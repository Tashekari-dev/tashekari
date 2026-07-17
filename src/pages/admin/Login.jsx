import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signIn } from "../../services/authService.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
const [submitting, setSubmitting] = useState(false);

const navigate = useNavigate();

 async function handleSubmit(event) {
  event.preventDefault();

  setError("");
  setSubmitting(true);

  try {
    await signIn(email, password);

    navigate("/admin");
  } catch (error) {
    setError(error.message || "Login failed. Please try again.");
  } finally {
    setSubmitting(false);
  }
}

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-[30px] border border-primary/10 bg-white p-8 shadow-xl sm:p-10">
        <div className="text-center">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-secondary">
            Tashekari
          </p>

          <h1 className="mt-3 font-heading text-4xl font-semibold text-primary">
            Admin Login
          </h1>

          <p className="mt-3 font-body text-sm text-[#75695F]">
            Sign in to manage products and orders.
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
              htmlFor="email"
              className="font-body text-sm font-medium text-primary"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@tashekari.com"
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
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
              className="mt-2 w-full rounded-2xl border border-primary/15 bg-background px-4 py-3 font-body text-primary outline-none transition focus:border-secondary"
            />
          </div>

          <button
  type="submit"
  disabled={submitting}
  className="w-full rounded-full bg-primary px-6 py-3 font-body font-medium text-white transition hover:bg-[#4E3829] disabled:cursor-not-allowed disabled:opacity-60"
>
  {submitting ? "Signing In..." : "Sign In"}
</button>
        </form>
      </div>
    </main>
  );
}