import React, { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { Table } from "../../components/Table";
import { useAuth } from "../../auth/AuthContext";
import { apiFetch } from "../../api/client";

type TeacherRow = { id: string; name: string; email: string; role: string };

export function TeachersPage() {
  const { token } = useAuth();
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function load() {
    const rows = await apiFetch<TeacherRow[]>("/api/users", { token: token! });
    setTeachers(rows.filter((u) => u.role === "TEACHER"));
  }

  useEffect(() => {
    load().catch((e: any) => setError(e?.message ?? "Failed to load teachers"));
  }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      setError(null);
      await apiFetch("/api/users", { method: "POST", token: token!, body: JSON.stringify({ name, email, password }) });
      setName("");
      setEmail("");
      setPassword("");
      await load();
    } catch (e: any) {
      setError(e?.message ?? "Failed to create teacher");
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this teacher?")) return;
    await apiFetch(`/api/users/${id}`, { method: "DELETE", token: token! });
    await load();
  }

  return (
    <Layout title="Teachers">
      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="card p-4">
        <div className="text-sm font-semibold">Create Teacher</div>
        <form className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-4" onSubmit={onCreate}>
          <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input
            className="input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn">Create</button>
        </form>
      </div>

      <div className="mt-6">
        <Table>
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((t) => (
              <tr key={t.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{t.name}</td>
                <td className="px-4 py-3 text-slate-600">{t.email}</td>
                <td className="px-4 py-3 text-right">
                  <button className="btn btn-secondary" onClick={() => onDelete(t.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Layout>
  );
}