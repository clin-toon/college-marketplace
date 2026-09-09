// @/routes/AdminRoute.tsx
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function AdminRoute({ children }: { children: ReactNode }) {
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
    // Remember where they were going, so login can send them back
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Regular users don't belong on admin pages
  if (user.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}
