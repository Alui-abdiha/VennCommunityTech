import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../routes/ProtectedRoute";
import AdminRoute from "../routes/AdminRoute";

import Dashboard from "../pages/dashboard/Dashboard";
import Projects from "../pages/dashboard/Project";       // ✅ your file is Project.jsx
import Tasks from "../pages/dashboard/Task";            // ✅ your file is Task.jsx
import Leaderboard from "../pages/dashboard/Leaderboard";

import AdminUsers from "../pages/AdminUsers";
import Teams from "../pages/dashboard/Teams";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Group */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Default dashboard route */}
          <Route index element={<Dashboard />} />

          {/* Dashboard pages */}
          <Route path="projects" element={<Projects />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="teams" element={<Teams />} />
        </Route>

        {/* Admin */}
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <DashboardLayout>
                <AdminUsers />
              </DashboardLayout>
            </AdminRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}