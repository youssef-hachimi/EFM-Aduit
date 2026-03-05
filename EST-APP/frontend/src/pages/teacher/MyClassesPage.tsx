import React, { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { Table } from "../../components/Table";
import { useAuth } from "../../auth/AuthContext";
import * as ClassesApi from "../../api/classes";

export function MyClassesPage() {
  const { token } = useAuth();
  const [classes, setClasses] = useState<ClassesApi.ClassRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ClassesApi.listClasses(token!)
      .then(setClasses)
      .catch((e: any) => setError(e?.message ?? "Failed to load classes"));
  }, []);

  return (
    <Layout title="My Classes">
      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      <Table>
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Class</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((c) => (
            <tr key={c.id} className="border-t border-slate-100">
              <td className="px-4 py-3">{c.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Layout>
  );
}