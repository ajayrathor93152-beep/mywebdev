import { z } from "zod";
import { connectDB, disconnectDB } from "../config/db.js";
import { env } from "../config/env.js";
import { Admin } from "../models/Admin.js";

const input = z
  .object({
    ADMIN_NAME: z.string().min(1).default("Owner"),
    ADMIN_EMAIL: z.string().trim().toLowerCase().email(),
    ADMIN_PASSWORD: z.string().min(12, "ADMIN_PASSWORD must be at least 12 characters"),
  })
  .parse(process.env);

await connectDB(env.MONGO_URI);

const existing = await Admin.findOne({ email: input.ADMIN_EMAIL });
if (existing) {
  console.info(`Admin ${input.ADMIN_EMAIL} already exists — nothing to do.`);
} else {
  await Admin.create({
    name: input.ADMIN_NAME,
    email: input.ADMIN_EMAIL,
    password: input.ADMIN_PASSWORD,
    role: "owner",
  });
  console.info(`✔ Created owner account ${input.ADMIN_EMAIL}. Remove ADMIN_PASSWORD from .env now.`);
}

await disconnectDB();
