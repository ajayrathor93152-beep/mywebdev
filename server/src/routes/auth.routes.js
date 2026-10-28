import { Router } from "express";
import { login, logout, logoutEverywhere, me, refresh } from "../controllers/auth.controller.js";
import { requireAuth, requireCsrfHeader } from "../middleware/auth.js";
import { loginLimiter, refreshLimiter } from "../middleware/rateLimit.js";
import { validate } from "../middleware/validate.js";
import { loginSchema } from "../validators/auth.schema.js";

const router = Router();

router.post("/login", loginLimiter, validate({ body: loginSchema }), login);
router.post("/refresh", refreshLimiter, requireCsrfHeader, refresh);
router.post("/logout", requireCsrfHeader, logout);
router.post("/logout-all", requireAuth, logoutEverywhere);
router.get("/me", requireAuth, me);

export default router;
