import { apiFetch } from "./client";

export type UserRole = "ADMIN" | "TEACHER";

export type LoginResponse = {
  token: string;
  user: { id: string; name: string; email: string; role: UserRole };
};

export async function login(email: string, password: string) {
  return apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}