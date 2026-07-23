import { useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { resetPassword } from "../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setSubmitting(true);

      await resetPassword(cleanEmail);

      setSuccess(
        "Password reset link sent. Please check your email inbox and spam folder."
      );

      setEmail("");
    } catch (resetError) {
      console.error("Password reset error:", resetError);

      setError(
        resetError?.message ||
          "Unable to send reset link. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
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
              Forgot Password
            </h1>

            <p className="mt-4 font-body text-sm leading-6 text-[#75695F]">
              Enter your registered email address. We will send you a password
              reset link.
            </p>
          </div>

          {success ? (
            <div className="mt-8">
              <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-5 font-body text-sm leading-7 text-green-700">
                {success}
              </div>

              <Link
                to="/login"
                className="mt-6 block w-full rounded-full bg-primary px-6 py-4 text-center font-body font-medium text-white transition hover:bg-[#4E3829]"
              >
                Back To Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-600">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="reset-email"
                  className="font-body text-sm font-medium text-primary"
                >
                  Email Address
                </label>

                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="mt-2 w-full rounded-2xl border border-primary/15 bg-background px-4 py-3 font-body text-primary outline-none transition focus:border-secondary"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-primary px-6 py-4 font-body font-medium text-white transition hover:bg-[#4E3829] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Sending Reset Link..."
                  : "Send Reset Link"}
              </button>
            </form>
          )}

          {!success && (
            <p className="mt-7 text-center font-body text-sm text-[#75695F]">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-semibold text-secondary transition hover:text-primary"
              >
                Sign In
              </Link>
            </p>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}