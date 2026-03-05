import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { query } from "../db.js";

export const usersRouter = Router();

/**
 * Admin: create teacher user
 */
const createTeacherSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

usersRouter.post("/", auth, requireRole("ADMIN"), async (req, res) => {
  const parsed = createTeacherSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload", issues: parsed.error.issues });

  const { name, email, password } = parsed.data;
  const passwordHash = await bcrypt.hash(password, 10);

  const created = await query<{ id: string; name: string; email: string; role: string }>(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, 'TEACHER')
     RETURNING id, name, email, role`,
    [name, email, passwordHash]
  );

  return res.status(201).json(created.rows[0]);
});

usersRouter.get("/", auth, requireRole("ADMIN"), async (_req, res) => {
  const result = await query<{ id: string; name: string; email: string; role: string }>(
    `SELECT id, name, email, role FROM users ORDER BY created_at DESC`
  );
  return res.json(result.rows);
});

usersRouter.delete("/:id", auth, requireRole("ADMIN"), async (req, res) => {
  await query(`DELETE FROM users WHERE id = $1 AND role = 'TEACHER'`, [req.params.id]);
  return res.status(204).send();
});