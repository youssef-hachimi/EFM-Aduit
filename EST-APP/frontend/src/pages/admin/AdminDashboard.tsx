import React, { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { StatCard } from "../../components/StatCard";
import { useAuth } from "../../auth/AuthContext";
import * as ReportsApi from "../../api/reports";

export function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<ReportsApi.AdminDashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setError(null);
        const s = await ReportsApi.getAdminDashboard(token!);
        setStats(s);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load dashboard");
      }
    })();
  }, [token]);

  return (
    <Layout title="Admin Dashboard">
      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Total Students" value={stats ? String(stats.totalStudents) : "—"} />
        <StatCard label="Absences Today" value={stats ? String(stats.absencesToday) : "—"} hint={stats?.today} />
        <StatCard label="Attendance Stats" value="(add charts)" hint="See Reports for more." />
      </div>

      <div className="mt-6 card p-4">
        <div className="text-sm font-semibold">Next improvements</div>
        <ul className="mt-2 list-disc pl-6 text-sm text-slate-600">
          <li>Charts and breakdown by class/date range</li>
          <li>Teacher management page improvements (edit/reset password)</li>
          <li>Enrollments UI (assign students to classes)</li>
        </ul>
      </div>
    </Layout>
  );
}