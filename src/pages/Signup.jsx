import { useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { signUp } from "../services/authService";

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const fullName = formData.fullName.trim();
    const email = formData.email.trim();

    if (
      !fullName ||
      !email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);

      await signUp(email, formData.password, fullName);

      setSuccess(
        "Account created successfully. Please check your email and confirm your account before signing in."
      );

      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (signupError) {
      console.error("Customer signup error:", signupError);

      setError(
        signupError?.message ||
          "Unable to create your account. Please try again."
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
              Create Account
            </h1>

            <p className="mt-4 font-body text-sm leading-6 text-[#75695F]">
              Create your Tashekari account to save your wishlist and track
              your orders.
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
                Go to Login
              </Link>

              <p className="mt-5 text-center font-body text-sm text-[#75695F]">
                Email confirm karne ke baad login karein.
              </p>
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
                  htmlFor="fullName"
                  className="font-body text-sm font-medium text-primary"
                >
                  Full Name
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                  className="mt-2 w-full rounded-2xl border border-primary/15 bg-background px-4 py-3 font-body text-primary outline-none transition focus:border-secondary"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="font-body text-sm font-medium text-primary"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="mt-2 w-full rounded-2xl border border-primary/15 bg-background px-4 py-3 font-body text-primary outline-none transition focus:border-secondary"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="font-body text-sm font-medium text-primary"
                >
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
                  required
                  className="mt-2 w-full rounded-2xl border border-primary/15 bg-background px-4 py-3 font-body text-primary outline-none transition focus:border-secondary"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="font-body text-sm font-medium text-primary"
                >
                  Confirm Password
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Enter password again"
                  autoComplete="new-password"
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
                  ? "Creating Account..."
                  : "Create Account"}
              </button>
            </form>
          )}

          {!success && (
            <p className="mt-7 text-center font-body text-sm text-[#75695F]">
              Already have an account?{" "}
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