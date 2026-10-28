import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, refreshSession, setAccessToken } from "@/lib/api";

const AuthContext = createContext(null);

/**
 * Wrap ONLY the admin area with this provider — public visitors never
 * trigger a refresh call. On mount it silently restores the session
 * from the HTTP-only refresh cookie.
 */
export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | authenticated | anonymous

  useEffect(() => {
    let cancelled = false;
    refreshSession()
      .then((data) => {
        if (cancelled) return;
        setAdmin(data.admin);
        setStatus("authenticated");
      })
      .catch(() => !cancelled && setStatus("anonymous"));

    const onExpired = () => {
      setAdmin(null);
      setStatus("anonymous");
    };
    window.addEventListener("auth:expired", onExpired);
    return () => {
      cancelled = true;
      window.removeEventListener("auth:expired", onExpired);
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await api.post("/auth/login", credentials, { skipAuthRefresh: true });
    setAccessToken(data.accessToken);
    setAdmin(data.admin);
    setStatus("authenticated");
    return data.admin;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout", null, { skipAuthRefresh: true });
    } finally {
      setAccessToken(null);
      setAdmin(null);
      setStatus("anonymous");
    }
  }, []);

  const value = useMemo(() => ({ admin, status, login, logout }), [admin, status, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
