import { apiFetch, apiUrl } from "./client";

export type AttendanceRow = {
  student_id: string;
  name: string;
  student_number: string;
  status: "PRESENT" | "ABSENT" | "LATE";
};

export async function getAttendance(token: string, class_id: string, date: string) {
  const usp = new URLSearchParams({ class_id, date });
  return apiFetch<AttendanceRow[]>(`/api/attendance?${usp.toString()}`, { token });
}

export async function markAttendance(
  token: string,
  payload: {
    class_id: string;
    date: string;
    records: { student_id: string; status: "PRESENT" | "ABSENT" | "LATE" }[];
  }
) {
  return apiFetch<{ ok: true }>("/api/attendance/mark", { method: "POST", token, body: JSON.stringify(payload) });
}

export function exportAttendanceCsvUrl(token: string, params: { class_id: string; from: string; to: string }) {
  const usp = new URLSearchParams(params);
  // We pass token via Authorization header typically, but for direct download we embed token is not ideal.
  // Minimal approach: open a new tab and rely on backend to support query param token in production you should use a signed URL.
  // Here we keep it simple: download via fetch (see utils/csv.ts).
  return apiUrl(`/api/attendance/export.csv?${usp.toString()}`);
}