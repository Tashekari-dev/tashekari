import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <BrowserRouter>
            <App />

          <Toaster
  position="top-center"
  reverseOrder={false}
  containerStyle={{
    top: "75px",
  }}
  toastOptions={{
    duration: 3000,
   style: {
  background: "#6B4F3A",
  color: "#FFFFFF",
  fontFamily: "Poppins, sans-serif",
  borderRadius: "14px",
  padding: "14px 18px",
  minWidth: "260px",
  maxWidth: "340px",
  boxShadow: "0 12px 35px rgba(107, 79, 58, 0.22)",
},
    success: {
      iconTheme: {
        primary: "#FFFFFF",
        secondary: "#6B4F3A",
      },
    },
    error: {
      duration: 4000,
      style: {
        background: "#B42318",
        color: "#FFFFFF",
      },
      iconTheme: {
        primary: "#FFFFFF",
        secondary: "#B42318",
      },
    },
  }}
/>
          </BrowserRouter>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  </StrictMode>
);