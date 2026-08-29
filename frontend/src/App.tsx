import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppRouter } from "@/routes/AppRouter";
import { AuthProvider } from "@/context/AuthContext";
import { FavouritesProvider } from "@/context/FavouritesContext";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FavouritesProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                borderRadius: "12px",
                background: "#081225",
                color: "#e7ebf5",
                border: "1px solid rgba(255,255,255,0.08)",
              },
              success: {
                iconTheme: { primary: "#22d3ee", secondary: "#081225" },
              },
              error: {
                iconTheme: { primary: "#D64550", secondary: "#081225" },
              },
            }}
          />
          <AppRouter />
        </FavouritesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
