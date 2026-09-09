import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-quad/30 border-t-quad" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admins don't belong on regular user pages — send them to the admin area
  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
