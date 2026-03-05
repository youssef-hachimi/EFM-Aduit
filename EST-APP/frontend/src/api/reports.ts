import { apiFetch } from "./client";

export type AdminDashboardStats = {
  today: string;
  totalStudents: number;
  absencesToday: number;
};

export async function getAdminDashboard(token: string) {
  return apiFetch<AdminDashboardStats>("/api/reports/dashboard", { token });
}