import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { query } from "../db.js";
import { config } from "../config.js";
import type { JwtPayload } from "../types.js";

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

authRouter.post("/login", async (req, res) => {
  const body = loginSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ message: "Invalid payload", issues: body.error.issues });

  const { email, password } = body.data;

  const userRes = await query<{
    id: string;
    name: string;
    email: string;
    password_hash: string;
    role: "ADMIN" | "TEACHER";
  }>(
    `SELECT id, name, email, password_hash, role
     FROM users
     WHERE email = $1`,
    [email]
  );

  const user = userRes.rows[0];
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const payload: JwtPayload = {
    sub: user.id,
    role: user.role,
    name: user.name,
    email: user.email
  };

  const token = jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});