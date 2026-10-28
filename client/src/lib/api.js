import axios from "axios";

/**
 * The access token lives ONLY in this module's memory — never localStorage —
 * so XSS can't read it from storage. On reload it's recovered via the
 * HTTP-only refresh cookie (POST /auth/refresh).
 */
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  withCredentials: true,
  timeout: 15_000,
  headers: { "X-Requested-With": "XMLHttpRequest" }, // required by the server's CSRF guard
});

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// Single-flight: if five requests 401 at once, only one refresh call is made.
let refreshPromise = null;

export function refreshSession() {
  refreshPromise ??= api
    .post("/auth/refresh", null, { skipAuthRefresh: true })
    .then(({ data }) => {
      setAccessToken(data.accessToken);
      return data;
    })
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const shouldRefresh =
      error.response?.status === 401 && original && !original._retried && !original.skipAuthRefresh;

    if (!shouldRefresh) throw error;

    original._retried = true;
    try {
      await refreshSession();
      return api(original);
    } catch (refreshError) {
      setAccessToken(null);
      window.dispatchEvent(new Event("auth:expired"));
      throw refreshError;
    }
  }
);

/** Normalises server errors into { message, fields } for forms and toasts. */
export function getApiError(error) {
  const body = error?.response?.data?.error;
  return {
    message: body?.message ?? (error?.code === "ECONNABORTED" ? "Request timed out" : "Network error"),
    code: body?.code,
    fields: body?.fields ?? {},
  };
}
