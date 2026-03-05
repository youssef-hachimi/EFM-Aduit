import React from "react";
import { Navigate } from "react-router-dom";
import type { UserRole } from "../api/auth";
import { useAuth } from "./AuthContext";

export function RequireAuth({ children, role }: { children: React.ReactNode; role: UserRole }) {
  const { token, user } = useAuth();

  if (!token || !user) return <Navigate to="/login" replace />;

  if (user.role !== role) {
    // Send user to their dashboard
    return <Navigate to={user.role === "ADMIN" ? "/admin" : "/teacher"} replace />;
  }

  return <>{children}</>;
}