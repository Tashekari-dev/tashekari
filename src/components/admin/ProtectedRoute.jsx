import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { getCurrentUser } from "../../services/authService.js";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkUser() {
      const currentUser = await getCurrentUser();

      setUser(currentUser);
      setLoading(false);
    }

    checkUser();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Checking Login...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}