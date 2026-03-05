import React, { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { Table } from "../../components/Table";
import { useAuth } from "../../auth/AuthContext";
import * as ClassesApi from "../../api/classes";
import { apiFetch } from "../../api/client";

type TeacherRow = { id: string; name: string; email: string; role: string };

export function ClassesPage() {
  const { token } = useAuth();
  const [classes, setClasses] = useState<ClassesApi.ClassRow[]>([]);
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [teacherId, setTeacherId] = useState<string>("");

  async function load() {
    const [cls, us] = await Promise.all([
      ClassesApi.listClasses(token!),
      apiFetch<TeacherRow[]>("/api/users", { token: token! })
    ]);
    setClasses(cls);
    setTeachers(us.filter((u) => u.role === "TEACHER"));
  }

  useEffect(() => {
    load().catch((e: any) => setError(e?.message ?? "Failed to load classes"));
  }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      setError(null);
      await ClassesApi.createClass(token!, { name, teacher_id: teacherId || null });
      setName("");
      setTeacherId("");
      await load();
    } catch (e: any) {
      setError(e?.message ?? "Failed to create class");
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this class?")) return;
    await ClassesApi.deleteClass(token!, id);
    await load();
  }

  return (
    <Layout title="Classes">
      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="card p-4">
        <div className="text-sm font-semibold">Create Class</div>
        <form className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-4" onSubmit={onCreate}>
          <input className="input" placeholder="Class name" value={name} onChange={(e) => setName(e.target.value)} />
          <select className="input" value={teacherId} onChange={(e) => setTeacherId(e.target.value)}>
            <option value="">(no teacher)</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <div className="md:col-span-2">
            <button className="btn">Create</button>
          </div>
        </form>
      </div>

      <div className="mt-6">
        <Table>
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Class</th>
              <th className="px-4 py-3">Teacher</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((c) => (
              <tr key={c.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{c.name}</td>
                <td className="px-4 py-3 text-slate-600">
                  {c.teacher_id ? teachers.find((t) => t.id === c.teacher_id)?.name ?? "—" : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="btn btn-secondary" onClick={() => onDelete(c.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="mt-6 card p-4 text-sm text-slate-600">
        Enrollment UI (assigning students to classes) is supported by the backend route <code>/api/enrollments</code>.
        If you want, I can add a dedicated “Enrollments” admin page next.
      </div>
    </Layout>
  );
}