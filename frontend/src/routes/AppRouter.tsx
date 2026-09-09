import { Navigate, Route, Routes } from "react-router-dom";
import Signup from "@/pages/auth/Signup";
import Login from "@/pages/auth/Login";
import VerifyOtp from "@/pages/auth/VerifyOtp";
import Home from "@/pages/home/Home";
import Listings from "@/pages/listings/Listings";
import ListingDetail from "@/pages/listings/ListingDetail";
import Favourites from "@/pages/favourites/Favourites";
import MyListings from "@/pages/my-listings/MyListings";
import MyListingDetail from "@/pages/my-listings/MyListingDetail";
import Notifications from "@/pages/notifications/Notifications";
import { ProtectedPage } from "@/routes/ProtectedPage";
import { useAuth } from "@/context/AuthContext";
import { AdminPage } from "./AdminPage";
import AdminHome from "@/pages/admin/AdminHome";
import Messages from "@/pages/chat/Messages";

export function AppRouter() {
  const { user } = useAuth();
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

      {/* Logged-in — sidebar shell + auth guard on every route */}
      <Route
        path="/home"
        element={
          <ProtectedPage>
            <Home />
          </ProtectedPage>
        }
      />

      <Route
        path="/listings"
        element={
          <ProtectedPage>
            <Listings />
          </ProtectedPage>
        }
      />
      {/* Detail page is protected but intentionally not in the sidebar nav */}
      <Route
        path="/listings/:id"
        element={
          <ProtectedPage>
            <ListingDetail />
          </ProtectedPage>
        }
      />
      <Route
        path="/favourites"
        element={
          <ProtectedPage>
            <Favourites />
          </ProtectedPage>
        }
      />
      <Route
        path="/my-listings"
        element={
          <ProtectedPage>
            <MyListings />
          </ProtectedPage>
        }
      />
      {/* Owner management detail — protected, not in sidebar nav */}
      <Route
        path="/my-listings/:id"
        element={
          <ProtectedPage>
            <MyListingDetail />
          </ProtectedPage>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedPage>
            <Notifications />
          </ProtectedPage>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedPage>
            <Messages />
          </ProtectedPage>
        }
      />
      <Route
        path="/messages/:listingId/:otherUserId"
        element={
          <ProtectedPage>
            <Messages />
          </ProtectedPage>
        }
      />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <AdminPage>
            <AdminHome />
          </AdminPage>
        }
      />

      <Route
        path="/admin/users"
        // element={
        //   <AdminPage>
        //     <AdminUsers />
        //   </AdminPage>
        // }
      />
      <Route
        path="/admin/listings"
        // element={
        //   <AdminPage>
        //     <AdminListings />
        //   </AdminPage>
        // }
      />

      {/* 404 */}
      <Route
        path="*"
        element={
          <Navigate to={user?.role === "admin" ? "/admin" : "/home"} replace />
        }
      />
    </Routes>
  );
}
