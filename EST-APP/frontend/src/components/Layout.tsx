import React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function Layout({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Topbar />
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[260px_1fr]">
          <Sidebar />
          <main>
            <h1 className="text-xl font-semibold">{title}</h1>
            <div className="mt-4">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}