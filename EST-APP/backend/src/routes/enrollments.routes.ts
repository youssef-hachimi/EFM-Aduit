import { Router } from "express";
import { z } from "zod";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { query } from "../db.js";

export const enrollmentsRouter = Router();

const schema = z.object({
  student_id: z.string().uuid(),
  class_id: z.string().uuid()
});

enrollmentsRouter.post("/", auth, requireRole("ADMIN"), async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload", issues: parsed.error.issues });

  const { student_id, class_id } = parsed.data;
  await query(`INSERT INTO enrollments (student_id, class_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [
    student_id,
    class_id
  ]);
  return res.status(201).json({ ok: true });
});

enrollmentsRouter.delete("/", auth, requireRole("ADMIN"), async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload", issues: parsed.error.issues });

  const { student_id, class_id } = parsed.data;
  await query(`DELETE FROM enrollments WHERE student_id = $1 AND class_id = $2`, [student_id, class_id]);
  return res.status(204).send();
});