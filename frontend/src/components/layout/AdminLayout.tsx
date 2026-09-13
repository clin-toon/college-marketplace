import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />

      <main className="flex-1 min-w-0 pt-16 lg:pt-0 lg:pl-72">
        <div className="w-full p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
