import { Navigate, Route, Routes } from "react-router-dom";
import Signup from "@/pages/auth/Signup";
import Login from "@/pages/auth/Login";
import VerifyOtp from "@/pages/auth/VerifyOtp";

/**
 * Public route tree. Only auth pages are reachable for now.
 * Logged-in (sidebar/home/listings/...) and admin route groups
 * get added here once we build those pages next.
 */
export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      {/* Placeholder until the logged-in dashboard is built */}
      <Route
        path="/home"
        element={
          <div className="flex min-h-screen items-center justify-center bg-paper font-display text-ink">
            Logged-in dashboard coming in the next step.
          </div>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
