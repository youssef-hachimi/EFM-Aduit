import { Router } from "express";
import { z } from "zod";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { query } from "../db.js";

export const studentsRouter = Router();

const createStudentSchema = z.object({
  name: z.string().min(2),
  student_number: z.string().min(3)
});

studentsRouter.post("/", auth, requireRole("ADMIN"), async (req, res) => {
  const parsed = createStudentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload", issues: parsed.error.issues });

  const { name, student_number } = parsed.data;
  const result = await query(
    `INSERT INTO students (name, student_number)
     VALUES ($1, $2)
     RETURNING id, name, student_number`,
    [name, student_number]
  );
  return res.status(201).json(result.rows[0]);
});

studentsRouter.get("/", auth, requireRole("ADMIN"), async (req, res) => {
  const page = Math.max(1, Number(req.query.page ?? 1));
  const pageSize = Math.min(100, Math.max(5, Number(req.query.pageSize ?? 20)));
  const q = String(req.query.q ?? "").trim();

  const where = q ? `WHERE (name ILIKE $1 OR student_number ILIKE $1)` : "";
  const params = q ? [`%${q}%`, pageSize, (page - 1) * pageSize] : [pageSize, (page - 1) * pageSize];

  const sql = q
    ? `SELECT id, name, student_number FROM students ${where} ORDER BY name ASC LIMIT $2 OFFSET $3`
    : `SELECT id, name, student_number FROM students ORDER BY name ASC LIMIT $1 OFFSET $2`;

  const result = await query(sql, params);
  return res.json({ page, pageSize, data: result.rows });
});

studentsRouter.delete("/:id", auth, requireRole("ADMIN"), async (req, res) => {
  await query(`DELETE FROM students WHERE id = $1`, [req.params.id]);
  return res.status(204).send();
});