import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { query } from "../db.js";

export const reportsRouter = Router();

reportsRouter.get("/dashboard", auth, requireRole("ADMIN"), async (_req, res) => {
  const today = new Date().toISOString().slice(0, 10);

  const totalStudents = await query<{ count: string }>(`SELECT COUNT(*)::text as count FROM students`);
  const absencesToday = await query<{ count: string }>(
    `SELECT COUNT(*)::text as count FROM attendance WHERE date = $1 AND status = 'ABSENT'`,
    [today]
  );

  return res.json({
    today,
    totalStudents: Number(totalStudents.rows[0]?.count ?? 0),
    absencesToday: Number(absencesToday.rows[0]?.count ?? 0)
  });
});