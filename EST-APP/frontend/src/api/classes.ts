import { apiFetch } from "./client";

export type ClassRow = { id: string; name: string; teacher_id: string | null };

export async function listClasses(token: string) {
  return apiFetch<ClassRow[]>("/api/classes", { token });
}

export async function createClass(token: string, payload: { name: string; teacher_id?: string | null }) {
  return apiFetch<ClassRow>("/api/classes", { method: "POST", token, body: JSON.stringify(payload) });
}

export async function updateClass(
  token: string,
  id: string,
  payload: { name: string; teacher_id?: string | null }
) {
  return apiFetch<ClassRow>(`/api/classes/${id}`, { method: "PUT", token, body: JSON.stringify(payload) });
}

export async function deleteClass(token: string, id: string) {
  return apiFetch<void>(`/api/classes/${id}`, { method: "DELETE", token });
}