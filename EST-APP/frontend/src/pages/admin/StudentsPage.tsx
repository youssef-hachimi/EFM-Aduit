import React, { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { Table } from "../../components/Table";
import { Pagination } from "../../components/Pagination";
import { useAuth } from "../../auth/AuthContext";
import * as StudentsApi from "../../api/students";

export function StudentsPage() {
  const { token } = useAuth();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<StudentsApi.StudentRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [studentNumber, setStudentNumber] = useState("");

  async function load(p = page) {
    const res = await StudentsApi.listStudents(token!, { page: p, pageSize: 20, q });
    setRows(res.data);
  }

  useEffect(() => {
    load().catch((e: any) => setError(e?.message ?? "Failed to load students"));
  }, [page]);

  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    await load(1);
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      setError(null);
      await StudentsApi.createStudent(token!, { name, student_number: studentNumber });
      setName("");
      setStudentNumber("");
      await load(1);
      setPage(1);
    } catch (e: any) {
      setError(e?.message ?? "Failed to create student");
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this student?")) return;
    await StudentsApi.deleteStudent(token!, id);
    await load();
  }

  return (
    <Layout title="Students">
      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="card p-4">
          <div className="text-sm font-semibold">Create Student</div>
          <form className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={onCreate}>
            <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input
              className="input"
              placeholder="Student number"
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)}
            />
            <button className="btn md:col-span-2">Create</button>
          </form>
        </div>

        <div className="card p-4">
          <div className="text-sm font-semibold">Search</div>
          <form className="mt-3 flex gap-2" onSubmit={onSearch}>
            <input className="input" placeholder="Name or number..." value={q} onChange={(e) => setQ(e.target.value)} />
            <button className="btn btn-secondary" type="submit">
              Search
            </button>
          </form>
          <div className="mt-2 text-xs text-slate-400">Pagination is enabled (20 per page).</div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-slate-600">{rows.length} results</div>
        <Pagination
          page={page}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => p + 1)}
        />
      </div>

      <div className="mt-3">
        <Table>
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Student #</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{s.name}</td>
                <td className="px-4 py-3 text-slate-600">{s.student_number}</td>
                <td className="px-4 py-3 text-right">
                  <button className="btn btn-secondary" onClick={() => onDelete(s.id)}>
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