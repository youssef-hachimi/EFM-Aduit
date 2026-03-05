import React, { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { StatCard } from "../../components/StatCard";
import { useAuth } from "../../auth/AuthContext";
import * as ClassesApi from "../../api/classes";

export function TeacherDashboard() {
  const { token } = useAuth();
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const cls = await ClassesApi.listClasses(token!);
      setCount(cls.length);
    })();
  }, [token]);

  return (
    <Layout title="Teacher Dashboard">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="My Classes" value={count === null ? "—" : String(count)} />
        <StatCard label="Mark Attendance" value="Open" hint="Go to Mark Attendance" />
        <StatCard label="History" value="View" hint="Go to Attendance History" />
      </div>

      <div className="mt-6 card p-4 text-sm text-slate-600">
        Workflow:
        <ol className="mt-2 list-decimal pl-6">
          <li>Go to My Classes to confirm your assigned classes</li>
          <li>Go to Mark Attendance, pick class + date, mark Present/Absent/Late</li>
          <li>Use History to export attendance CSV by date range</li>
        </ol>
      </div>
    </Layout>
  );
}