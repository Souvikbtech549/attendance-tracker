import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-300">Loading...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
