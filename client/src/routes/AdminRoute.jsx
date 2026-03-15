import { Navigate } from "react-router-dom";
import { getUser, isAuthed } from "../services/auth";

export default function AdminRoute({ children }) {
  if (!isAuthed()) return <Navigate to="/login" replace />;
  const user = getUser();
  if (!user || user.role !== "ADMIN") return <Navigate to="/dashboard" replace />;
  return children;
}