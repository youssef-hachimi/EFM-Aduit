import React, { useEffect, useMemo, useState } from "react";
import { Layout } from "../../components/Layout";
import { Table } from "../../components/Table";
import { useAuth } from "../../auth/AuthContext";
import * as ClassesApi from "../../api/classes";
import * as AttendanceApi from "../../api/attendance";
import { todayYmd } from "../../utils/date";

export function AttendanceMarkingPage() {
  const { token } = useAuth();
  const [classes, setClasses] = useState<ClassesApi.ClassRow[]>([]);
  const [classId, setClassId] = useState("");
  const [date, setDate] = useState(todayYmd());
  const [rows, setRows] = useState<AttendanceApi.AttendanceRow[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const cls = await ClassesApi.listClasses(token!);
      setClasses(cls);
      if (cls[0]) setClassId(cls[0].id);
    })().catch((e: any) => setError(e?.message ?? "Failed to load classes"));
  }, [token]);

  useEffect(() => {
    if (!classId || !date) return;
    AttendanceApi.getAttendance(token!, classId, date)
      .then(setRows)
      .catch((e: any) => setError(e?.message ?? "Failed to load attendance"));
  }, [token, classId, date]);

  const statusCounts = useMemo(() => {
    const c = { PRESENT: 0, ABSENT: 0, LATE: 0 };
    for (const r of rows) c[r.status]++;
    return c;
  }, [rows]);

  function setStatus(student_id: string, status: "PRESENT" | "ABSENT" | "LATE") {
    setRows((prev) => prev.map((r) => (r.student_id === student_id ? { ...r, status } : r)));
  }

  async function onSave() {
    try {
      setError(null);
      setSaving(true);
      await AttendanceApi.markAttendance(token!, {
        class_id: classId,
        date,
        records: rows.map((r) => ({ student_id: r.student_id, status: r.status }))
      });
      alert("Attendance saved.");
    } catch (e: any) {
      setError(e?.message ?? "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout title="Mark Attendance">
      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="card p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <div>
            <div className="label">Class</div>
            <select className="input mt-1" value={classId} onChange={(e) => setClassId(e.target.value)}>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="label">Date</div>
            <input className="input mt-1" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="md:col-span-2 flex items-end justify-end gap-2">
            <div className="text-sm text-slate-600">
              Present: {statusCounts.PRESENT} · Absent: {statusCounts.ABSENT} · Late: {statusCounts.LATE}
            </div>
            <button className="btn" onClick={onSave} disabled={saving || !classId}>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Table>
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Number</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.student_id} className="border-t border-slate-100">
                <td className="px-4 py-3">{r.name}</td>
                <td className="px-4 py-3 text-slate-600">{r.student_number}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      className={r.status === "PRESENT" ? "btn" : "btn btn-secondary"}
                      onClick={() => setStatus(r.student_id, "PRESENT")}
                      type="button"
                    >
                      Present
                    </button>
                    <button
                      className={r.status === "ABSENT" ? "btn" : "btn btn-secondary"}
                      onClick={() => setStatus(r.student_id, "ABSENT")}
                      type="button"
                    >
                      Absent
                    </button>
                    <button
                      className={r.status === "LATE" ? "btn" : "btn btn-secondary"}
                      onClick={() => setStatus(r.student_id, "LATE")}
                      type="button"
                    >
                      Late
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="mt-3 text-xs text-slate-400">
          Note: default status for students without a record is shown as PRESENT (until saved).
        </div>
      </div>
    </Layout>
  );
}