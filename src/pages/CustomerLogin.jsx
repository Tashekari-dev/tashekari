import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { signIn } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function CustomerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const {
    isAuthenticated,
    authLoading,
  } = useAuth();

  const redirectPath =
    location.state?.from?.pathname || "/";

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirectPath, {
        replace: true,
      });
    }
  }, [
    authLoading,
    isAuthenticated,
    navigate,
    redirectPath,
  ]);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setSubmitting(true);

      await signIn(cleanEmail, password);

      navigate(redirectPath, {
        replace: true,
      });
    } catch (loginError) {
      console.error("Customer login error:", loginError);

      setError(
        loginError?.message ||
          "Unable to sign in. Please check your details."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="font-body text-primary">
          Checking your account...
        </p>
      </main>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background px-4 pb-20 pt-32">
        <div className="mx-auto w-full max-w-md rounded-[32px] border border-primary/10 bg-white p-7 shadow-xl sm:p-10">
          <div className="text-center">
            <p className="font-body text-xs uppercase tracking-[0.35em] text-secondary">
              Tashekari
            </p>

            <h1 className="mt-4 font-heading text-5xl font-semibold text-primary">
              Welcome Back
            </h1>

            <p className="mt-4 font-body text-sm leading-6 text-[#75695F]">
              Sign in to view your orders, wishlist and account details.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="customer-email"
                className="font-body text-sm font-medium text-primary"
              >
                Email Address
              </label>

              <input
                id="customer-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="mt-2 w-full rounded-2xl border border-primary/15 bg-background px-4 py-3 font-body text-primary outline-none transition focus:border-secondary"
              />
            </div>

            <div>
              <div className="flex items-center justify-between gap-4">
                <label
                  htmlFor="customer-password"
                  className="font-body text-sm font-medium text-primary"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="font-body text-xs font-medium text-secondary transition hover:text-primary"
                >
                  Forgot Password?
                </Link>
              </div>

              <input
                id="customer-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="mt-2 w-full rounded-2xl border border-primary/15 bg-background px-4 py-3 font-body text-primary outline-none transition focus:border-secondary"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-primary px-6 py-4 font-body font-medium text-white transition hover:bg-[#4E3829] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="mt-7 text-center font-body text-sm text-[#75695F]">
            New to Tashekari?{" "}
            <Link
              to="/signup"
              className="font-semibold text-secondary transition hover:text-primary"
            >
              Create Account
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}