import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell-bg min-h-screen">
      <Sidebar />
      <div className="ml-64 min-h-screen ">{children}</div>
    </div>
  );
}
