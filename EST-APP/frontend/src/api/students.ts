import { apiFetch } from "./client";

export type StudentRow = { id: string; name: string; student_number: string };

export type StudentsPaged = {
  page: number;
  pageSize: number;
  data: StudentRow[];
};

export async function listStudents(token: string, params: { page?: number; pageSize?: number; q?: string }) {
  const usp = new URLSearchParams();
  if (params.page) usp.set("page", String(params.page));
  if (params.pageSize) usp.set("pageSize", String(params.pageSize));
  if (params.q) usp.set("q", params.q);
  return apiFetch<StudentsPaged>(`/api/students?${usp.toString()}`, { token });
}

export async function createStudent(token: string, payload: { name: string; student_number: string }) {
  return apiFetch<StudentRow>("/api/students", { method: "POST", token, body: JSON.stringify(payload) });
}

export async function deleteStudent(token: string, id: string) {
  return apiFetch<void>(`/api/students/${id}`, { method: "DELETE", token });
}