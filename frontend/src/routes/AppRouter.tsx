import { Navigate, Route, Routes } from "react-router-dom";
import Signup from "@/pages/auth/Signup";
import Login from "@/pages/auth/Login";
import VerifyOtp from "@/pages/auth/VerifyOtp";
import Home from "@/pages/home/Home";
import Listings from "@/pages/listings/Listings";
import ListingDetail from "@/pages/listings/ListingDetail";
import Favourites from "@/pages/favourites/Favourites";
import MyListings from "@/pages/my-listings/MyListings";
import Notifications from "@/pages/notifications/Notifications";
import ContactRequests from "@/pages/contact-requests/ContactRequests";
import { ProtectedPage } from "@/routes/ProtectedPage";

export function AppRouter() {
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
      <Route
        path="/notifications"
        element={
          <ProtectedPage>
            <Notifications />
          </ProtectedPage>
        }
      />
      <Route
        path="/contact-requests"
        element={
          <ProtectedPage>
            <ContactRequests />
          </ProtectedPage>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
