import { Router } from "express";
import { z } from "zod";
import { auth, type AuthedRequest } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { query } from "../db.js";

export const classesRouter = Router();

const classSchema = z.object({
  name: z.string().min(2),
  teacher_id: z.string().uuid().nullable().optional()
});

classesRouter.post("/", auth, requireRole("ADMIN"), async (req, res) => {
  const parsed = classSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload", issues: parsed.error.issues });

  const { name, teacher_id } = parsed.data;
  const result = await query(
    `INSERT INTO classes (name, teacher_id) VALUES ($1, $2)
     RETURNING id, name, teacher_id`,
    [name, teacher_id ?? null]
  );
  return res.status(201).json(result.rows[0]);
});

classesRouter.get("/", auth, async (req: AuthedRequest, res) => {
  // Admin sees all classes; Teacher sees only their classes
  if (req.user?.role === "ADMIN") {
    const result = await query(`SELECT id, name, teacher_id FROM classes ORDER BY name ASC`);
    return res.json(result.rows);
  }

  const result = await query(`SELECT id, name, teacher_id FROM classes WHERE teacher_id = $1 ORDER BY name ASC`, [
    req.user!.sub
  ]);
  return res.json(result.rows);
});

classesRouter.put("/:id", auth, requireRole("ADMIN"), async (req, res) => {
  const parsed = classSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload", issues: parsed.error.issues });

  const { name, teacher_id } = parsed.data;
  const result = await query(
    `UPDATE classes SET name = $1, teacher_id = $2 WHERE id = $3
     RETURNING id, name, teacher_id`,
    [name, teacher_id ?? null, req.params.id]
  );
  return res.json(result.rows[0]);
});

classesRouter.delete("/:id", auth, requireRole("ADMIN"), async (req, res) => {
  await query(`DELETE FROM classes WHERE id = $1`, [req.params.id]);
  return res.status(204).send();
});