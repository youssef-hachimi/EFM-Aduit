import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RequireAuth } from "./auth/RequireAuth";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { TeachersPage } from "./pages/admin/TeachersPage";
import { ClassesPage } from "./pages/admin/ClassesPage";
import { StudentsPage } from "./pages/admin/StudentsPage";
import { ReportsPage } from "./pages/admin/ReportsPage";
import { TeacherDashboard } from "./pages/teacher/TeacherDashboard";
import { MyClassesPage } from "./pages/teacher/MyClassesPage";
import { AttendanceMarkingPage } from "./pages/teacher/AttendanceMarkingPage";
import { AttendanceHistoryPage } from "./pages/teacher/AttendanceHistoryPage";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <RequireAuth role="ADMIN">
            <AdminDashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/teachers"
        element={
          <RequireAuth role="ADMIN">
            <TeachersPage />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/classes"
        element={
          <RequireAuth role="ADMIN">
            <ClassesPage />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/students"
        element={
          <RequireAuth role="ADMIN">
            <StudentsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <RequireAuth role="ADMIN">
            <ReportsPage />
          </RequireAuth>
        }
      />

      {/* Teacher */}
      <Route
        path="/teacher"
        element={
          <RequireAuth role="TEACHER">
            <TeacherDashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/teacher/classes"
        element={
          <RequireAuth role="TEACHER">
            <MyClassesPage />
          </RequireAuth>
        }
      />
      <Route
        path="/teacher/attendance"
        element={
          <RequireAuth role="TEACHER">
            <AttendanceMarkingPage />
          </RequireAuth>
        }
      />
      <Route
        path="/teacher/history"
        element={
          <RequireAuth role="TEACHER">
            <AttendanceHistoryPage />
          </RequireAuth>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}