import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppRouter } from "@/routes/AppRouter";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            borderRadius: "12px",
            background: "#1B1C2B",
            color: "#F7F8FB",
          },
          success: { iconTheme: { primary: "#2E8B7E", secondary: "#F7F8FB" } },
          error: { iconTheme: { primary: "#D64550", secondary: "#F7F8FB" } },
        }}
      />
      <AppRouter />
    </BrowserRouter>
  );
}
