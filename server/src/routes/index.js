import { Router } from "express";
import authRoutes from "./auth.routes.js";
import inquiryRoutes from "./inquiry.routes.js";

const router = Router();

router.get("/health", (_req, res) => res.json({ status: "ok", uptime: process.uptime() }));
router.use("/auth", authRoutes);
router.use("/inquiries", inquiryRoutes);

export default router;
