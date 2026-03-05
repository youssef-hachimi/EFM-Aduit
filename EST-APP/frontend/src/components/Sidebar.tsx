import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import clsx from "clsx";

function Item({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          "block rounded-md px-3 py-2 text-sm",
          isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
        )
      }
    >
      {label}
    </NavLink>
  );
}

export function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="card p-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Navigation</div>
      <div className="mt-2 space-y-1">
        {user?.role === "ADMIN" ? (
          <>
            <Item to="/admin" label="Dashboard" />
            <Item to="/admin/teachers" label="Teachers" />
            <Item to="/admin/classes" label="Classes" />
            <Item to="/admin/students" label="Students" />
            <Item to="/admin/reports" label="Reports" />
          </>
        ) : (
          <>
            <Item to="/teacher" label="Dashboard" />
            <Item to="/teacher/classes" label="My Classes" />
            <Item to="/teacher/attendance" label="Mark Attendance" />
            <Item to="/teacher/history" label="Attendance History" />
          </>
        )}
      </div>
    </aside>
  );
}