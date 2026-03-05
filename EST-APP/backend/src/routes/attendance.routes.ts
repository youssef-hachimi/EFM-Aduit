import { Router } from "express";
import { z } from "zod";
import { auth, type AuthedRequest } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { query } from "../db.js";
import { stringify } from "csv-stringify";

export const attendanceRouter = Router();

const upsertSchema = z.object({
  class_id: z.string().uuid(),
  date: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/),
  records: z.array(
    z.object({
      student_id: z.string().uuid(),
      status: z.enum(["PRESENT", "ABSENT", "LATE"])
    })
  )
});

/**
 * Teacher marks attendance for a class & date.
 * Uses UPSERT.
 */
attendanceRouter.post("/mark", auth, requireRole("TEACHER"), async (req: AuthedRequest, res) => {
  const parsed = upsertSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload", issues: parsed.error.issues });

  const { class_id, date, records } = parsed.data;

  // Ensure teacher owns the class
  const cls = await query(`SELECT id FROM classes WHERE id = $1 AND teacher_id = $2`, [class_id, req.user!.sub]);
  if (cls.rowCount === 0) return res.status(403).json({ message: "Forbidden" });

  // Transaction-like approach (simple; for production you can use client + BEGIN)
  for (const r of records) {
    await query(
      `INSERT INTO attendance (student_id, class_id, date, status)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (student_id, class_id, date)
       DO UPDATE SET status = EXCLUDED.status`,
      [r.student_id, class_id, date, r.status]
    );
  }

  return res.json({ ok: true });
});

/**
 * Get attendance for a class & date (teacher or admin).
 */
attendanceRouter.get("/", auth, async (req: AuthedRequest, res) => {
  const classId = String(req.query.class_id ?? "");
  const date = String(req.query.date ?? "");
  if (!classId || !date) return res.status(400).json({ message: "class_id and date are required" });

  if (req.user?.role === "TEACHER") {
    const cls = await query(`SELECT id FROM classes WHERE id = $1 AND teacher_id = $2`, [classId, req.user.sub]);
    if (cls.rowCount === 0) return res.status(403).json({ message: "Forbidden" });
  }

  const result = await query(
    `SELECT s.id as student_id, s.name, s.student_number,
            COALESCE(a.status, 'PRESENT') as status
     FROM enrollments e
     JOIN students s ON s.id = e.student_id
     LEFT JOIN attendance a
       ON a.student_id = e.student_id AND a.class_id = e.class_id AND a.date = $2
     WHERE e.class_id = $1
     ORDER BY s.name ASC`,
    [classId, date]
  );

  return res.json(result.rows);
});

/**
 * Export attendance (teacher or admin) to CSV for a class between dates.
 */
attendanceRouter.get("/export.csv", auth, async (req: AuthedRequest, res) => {
  const classId = String(req.query.class_id ?? "");
  const from = String(req.query.from ?? "");
  const to = String(req.query.to ?? "");
  if (!classId || !from || !to) return res.status(400).json({ message: "class_id, from, to are required" });

  if (req.user?.role === "TEACHER") {
    const cls = await query(`SELECT id FROM classes WHERE id = $1 AND teacher_id = $2`, [classId, req.user.sub]);
    if (cls.rowCount === 0) return res.status(403).json({ message: "Forbidden" });
  }

  const data = await query(
    `SELECT a.date, s.student_number, s.name, a.status
     FROM attendance a
     JOIN students s ON s.id = a.student_id
     WHERE a.class_id = $1 AND a.date BETWEEN $2 AND $3
     ORDER BY a.date ASC, s.name ASC`,
    [classId, from, to]
  );

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="attendance_${classId}_${from}_${to}.csv"`);

  const stringifier = stringify({ header: true, columns: ["date", "student_number", "name", "status"] });
  for (const row of data.rows) stringifier.write(row);
  stringifier.end();
  stringifier.pipe(res);
});