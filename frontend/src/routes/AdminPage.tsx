import type { ReactNode } from "react";
import { AdminRoute } from "@/routes/AdminRoute";
import { AdminLayout } from "@/components/layout/AdminLayout"; // sidebar shell for admin

export function AdminPage({ children }: { children: ReactNode }) {
  return (
    <AdminRoute>
      <AdminLayout>{children}</AdminLayout>
    </AdminRoute>
  );
}
