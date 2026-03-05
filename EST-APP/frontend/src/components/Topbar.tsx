import React from "react";
import { useAuth } from "../auth/AuthContext";

export function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <div className="font-semibold">College Absence Manager</div>
        <div className="flex items-center gap-3">
          {user && (
            <div className="text-sm text-slate-600">
              {user.name} <span className="text-slate-400">({user.role})</span>
            </div>
          )}
          {user && (
            <button className="btn btn-secondary" onClick={logout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}