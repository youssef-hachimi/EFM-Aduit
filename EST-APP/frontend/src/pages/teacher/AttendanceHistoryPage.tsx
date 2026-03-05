import React, { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { useAuth } from "../../auth/AuthContext";
import * as ClassesApi from "../../api/classes";
import { apiUrl } from "../../api/client";
import { downloadCsvWithAuth } from "../../utils/csv";
import { todayYmd } from "../../utils/date";

export function AttendanceHistoryPage() {
  const { token } = useAuth();
  const [classes, setClasses] = useState<ClassesApi.ClassRow[]>([]);
  const [classId, setClassId] = useState("");
  const [from, setFrom] = useState(todayYmd());
  const [to, setTo] = useState(todayYmd());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const cls = await ClassesApi.listClasses(token!);
      setClasses(cls);
      if (cls[0]) setClassId(cls[0].id);
    })().catch((e: any) => setError(e?.message ?? "Failed to load classes"));
  }, [token]);

  async function onExport() {
    try {
      setError(null);
      const url = apiUrl(`/api/attendance/export.csv?class_id=${classId}&from=${from}&to=${to}`);
      await downloadCsvWithAuth({
        url,
        token: token!,
        filename: `attendance_${classId}_${from}_${to}.csv`
      });
    } catch (e: any) {
      setError(e?.message ?? "Export failed");
    }
  }

  return (
    <Layout title="Attendance History">
      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="card p-4">
        <div className="text-sm font-semibold">Export Attendance to CSV</div>

        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-4">
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
            <div className="label">From</div>
            <input className="input mt-1" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>

          <div>
            <div className="label">To</div>
            <input className="input mt-1" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>

          <div className="flex items-end justify-end">
            <button className="btn" onClick={onExport} disabled={!classId}>
              Export CSV
            </button>
          </div>
        </div>

        <div className="mt-3 text-sm text-slate-600">
          Calendar-style history UI can be added here by introducing an endpoint that lists attendance dates and summary
          counts per day.
        </div>
      </div>
    </Layout>
  );
}