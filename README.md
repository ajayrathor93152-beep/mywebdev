# Aurex Studio — Agency Website (MERN)

Premium agency site: React + Tailwind v4 + Motion on the front, Express + MongoDB on the back,
with JWT access/refresh auth for the admin area.

## Structure

```
.
├── client/                         React (Vite) app
│   ├── index.html                  fonts + no-flash theme script
│   └── src/
│       ├── main.jsx                providers (Theme, Router)
│       ├── App.jsx                 routes, lazy pages, page transitions, smooth scroll
│       ├── index.css               design tokens ("Ink & Volt"), light/dark, utilities
│       ├── config/site.js          brand name, contact details, nav, socials
│       ├── context/
│       │   ├── ThemeContext.jsx    toggle with circular View-Transition reveal
│       │   └── AuthContext.jsx     admin session (wrap admin routes only)
│       ├── hooks/useSmoothScroll.js  Lenis
│       ├── lib/
│       │   ├── api.js              axios: in-memory access token, auto refresh on 401
│       │   ├── motion.js           shared easing + variants
│       │   └── cn.js
│       ├── components/
│       │   ├── layout/             Navbar, Footer, Layout, PageTransition
│       │   ├── ui/                 Button (magnetic), ThemeToggle, Logo, PageIntro
│       │   └── home/               Hero, Marquee, WhyChooseUs, CtaBand
│       └── pages/                  Home, Services, Work, About, Contact, NotFound
│
└── server/                         Express API
    └── src/
        ├── server.js               boot + graceful shutdown
        ├── app.js                  helmet, CORS, sanitize, hpp, rate limit, routes
        ├── config/                 env (Zod-validated), db
        ├── models/                 Admin, RefreshToken, Inquiry
        ├── validators/             Zod schemas
        ├── middleware/             auth, rateLimit, validate, errorHandler
        ├── services/               token rotation, mail
        ├── controllers/            auth, inquiry
        ├── routes/
        ├── utils/                  tokens (JWT), ApiError, asyncHandler
        └── scripts/seedAdmin.js
```

## Setup

Requirements: Node 20.6+, MongoDB (local or Atlas).

```bash
# 1. API
cd server
cp .env.example .env        # fill in MONGO_URI, both JWT secrets, admin creds
npm install
npm run seed:admin          # creates the owner account once
npm run dev                 # http://localhost:5000

# 2. Client (new terminal)
cd client
npm install
npm run dev                 # http://localhost:5173  (proxies /api → :5000)
```

Generate JWT secrets: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

## API

| Method | Route                       | Auth           | Notes                                  |
| ------ | --------------------------- | -------------- | -------------------------------------- |
| GET    | `/api/health`               | —              |                                        |
| POST   | `/api/auth/login`           | —              | 5 failed tries / 15 min + account lock |
| POST   | `/api/auth/refresh`         | cookie + CSRF  | rotates refresh token                  |
| POST   | `/api/auth/logout`          | cookie + CSRF  | revokes the session family             |
| POST   | `/api/auth/logout-all`      | Bearer         | revokes every session                  |
| GET    | `/api/auth/me`              | Bearer         |                                        |
| POST   | `/api/inquiries`            | —              | 5 / hour, honeypot, email notify       |
| GET    | `/api/inquiries`            | Bearer         | `?page&limit&status`                   |
| PATCH  | `/api/inquiries/:id/status` | Bearer         |                                        |

## How auth works

- **Access token**: JWT, 15 min, returned in the JSON body and kept in JS memory only (never localStorage).
- **Refresh token**: JWT, 7 days, in an `HttpOnly; Secure; SameSite=Strict` cookie scoped to `/api/auth`.
- **Rotation**: every refresh token works once. Each one is tracked by `jti` in MongoDB, grouped into a login "family".
  Replaying a used token revokes the whole family (stolen-token detection).
- **CSRF**: cookie endpoints require `X-Requested-With: XMLHttpRequest`. Cross-origin pages can't send it past strict CORS.
- **Reload**: the client calls `/auth/refresh` to get a fresh access token from the cookie.
