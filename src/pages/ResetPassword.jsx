import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { supabase } from "../lib/supabase";
import { updatePassword } from "../services/authService";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [checkingSession, setCheckingSession] = useState(true);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkRecoverySession() {
      try {
        const urlParams = new URLSearchParams(window.location.search);

        const urlError = urlParams.get("error");
        const errorCode = urlParams.get("error_code");
        const errorDescription = urlParams.get(
          "error_description"
        );

        if (urlError || errorCode) {
          if (!mounted) return;

          setError(
            errorDescription
              ? decodeURIComponent(
                  errorDescription.replace(/\+/g, " ")
                )
              : "This password reset link is invalid or has expired."
          );

          setHasRecoverySession(false);
          setCheckingSession(false);
          return;
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!mounted) return;

        if (session) {
          setHasRecoverySession(true);
          setError("");
        } else {
          setHasRecoverySession(false);
          setError(
            "This password reset link is invalid or has expired. Please request a new link."
          );
        }
      } catch (sessionError) {
        console.error(
          "Recovery session error:",
          sessionError
        );

        if (!mounted) return;

        setHasRecoverySession(false);
        setError(
          sessionError?.message ||
            "Unable to verify the password reset link."
        );
      } finally {
        if (mounted) {
          setCheckingSession(false);
        }
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;

        if (
          event === "PASSWORD_RECOVERY" ||
          event === "SIGNED_IN"
        ) {
          if (session) {
            setHasRecoverySession(true);
            setError("");
            setCheckingSession(false);
          }
        }
      }
    );

    checkRecoverySession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!hasRecoverySession) {
      setError(
        "Your password reset link is invalid or has expired. Please request a new link."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);

      await updatePassword(password);

      setSuccess(
        "Password updated successfully. Redirecting to login..."
      );

      setPassword("");
      setConfirmPassword("");

      await supabase.auth.signOut();

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 2000);
    } catch (resetError) {
      console.error(
        "Password update error:",
        resetError
      );

      if (
        resetError?.message
          ?.toLowerCase()
          .includes("auth session missing")
      ) {
        setHasRecoverySession(false);
        setError(
          "Your password reset session has expired. Please request a new reset link."
        );
      } else {
        setError(
          resetError?.message ||
            "Unable to update password. Please try again."
        );
      }
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
              Reset Password
            </h1>

            <p className="mt-4 font-body text-sm leading-6 text-[#75695F]">
              Create a secure new password for your
              account.
            </p>
          </div>

          {checkingSession ? (
            <div className="mt-8 rounded-2xl border border-primary/10 bg-background px-5 py-5 text-center font-body text-sm text-primary">
              Verifying reset link...
            </div>
          ) : (
            <>
              {error && (
                <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 font-body text-sm leading-6 text-red-600">
                  {error}
                </div>
              )}

              {success && (
                <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 font-body text-sm leading-6 text-green-700">
                  {success}
                </div>
              )}

              {hasRecoverySession && !success ? (
                <form
                  onSubmit={handleSubmit}
                  className="mt-8 space-y-5"
                >
                  <div>
                    <label
                      htmlFor="new-password"
                      className="font-body text-sm font-medium text-primary"
                    >
                      New Password
                    </label>

                    <input
                      id="new-password"
                      type="password"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Minimum 6 characters"
                      autoComplete="new-password"
                      required
                      minLength={6}
                      className="mt-2 w-full rounded-2xl border border-primary/15 bg-background px-4 py-3 font-body text-primary outline-none transition focus:border-secondary"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="font-body text-sm font-medium text-primary"
                    >
                      Confirm Password
                    </label>

                    <input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(
                          event.target.value
                        )
                      }
                      placeholder="Enter password again"
                      autoComplete="new-password"
                      required
                      minLength={6}
                      className="mt-2 w-full rounded-2xl border border-primary/15 bg-background px-4 py-3 font-body text-primary outline-none transition focus:border-secondary"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full bg-primary px-6 py-4 font-body font-medium text-white transition hover:bg-[#4E3829] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting
                      ? "Updating Password..."
                      : "Update Password"}
                  </button>
                </form>
              ) : null}

              {!hasRecoverySession && !success && (
                <Link
                  to="/forgot-password"
                  className="mt-6 block w-full rounded-full bg-primary px-6 py-4 text-center font-body font-medium text-white transition hover:bg-[#4E3829]"
                >
                  Request New Reset Link
                </Link>
              )}

              <Link
                to="/login"
                className="mt-6 block text-center font-body text-sm font-medium text-secondary transition hover:text-primary"
              >
                Back To Login
              </Link>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}