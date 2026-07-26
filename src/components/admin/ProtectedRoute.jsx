import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { getCurrentUser } from "../../services/authService.js";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const currentUser = await getCurrentUser();
        const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

        if (
          currentUser &&
          currentUser.email?.toLowerCase() === adminEmail?.toLowerCase()
        ) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Admin verification error:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F5F1] text-[#6B4F3A]">
        Checking admin access...
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}