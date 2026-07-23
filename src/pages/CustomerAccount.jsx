import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function CustomerAccount() {
  const { user, authLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", {
        replace: true,
        state: {
          from: {
            pathname: "/account",
          },
        },
      });
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    async function fetchCustomerOrders() {
      if (!user?.email) return;

      try {
        setLoadingOrders(true);
        setError("");

        const { data, error: ordersError } = await supabase
          .from("orders")
          .select(
            "id, amount, payment_method, payment_status, status, created_at, courier_name, tracking_number"
          )
          .eq("email", user.email)
          .order("created_at", {
            ascending: false,
          });

        if (ordersError) {
          throw ordersError;
        }

        setOrders(data || []);
      } catch (fetchError) {
        console.error("Customer orders error:", fetchError);

        setError(
          fetchError?.message ||
            "Unable to load your orders."
        );
      } finally {
        setLoadingOrders(false);
      }
    }

    fetchCustomerOrders();
  }, [user]);

  async function handleLogout() {
    try {
      await logout();
      navigate("/", {
        replace: true,
      });
    } catch (logoutError) {
      console.error("Customer logout error:", logoutError);
      alert(
        logoutError?.message ||
          "Unable to logout."
      );
    }
  }

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="font-body text-primary">
          Loading your account...
        </p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const fullName =
    user.user_metadata?.full_name ||
    "Tashekari Customer";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background pb-20 pt-32">
        <section className="border-b border-primary/10 px-6 py-12">
          <div className="mx-auto max-w-7xl">
            <p className="font-body text-xs uppercase tracking-[0.35em] text-secondary">
              My Account
            </p>

            <h1 className="mt-4 font-heading text-5xl font-semibold text-primary">
              Welcome, {fullName}
            </h1>

            <p className="mt-3 font-body text-[#75695F]">
              Manage your profile and view your Tashekari orders.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[320px_1fr] lg:px-10">
          <aside className="h-fit rounded-[30px] bg-white p-6 shadow-lg">
            <div className="rounded-2xl bg-background p-5">
              <p className="font-body text-xs uppercase tracking-[0.25em] text-secondary">
                Profile
              </p>

              <h2 className="mt-3 font-heading text-3xl font-semibold text-primary">
                {fullName}
              </h2>

              <p className="mt-2 break-all font-body text-sm text-[#75695F]">
                {user.email}
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <Link
                to="/wishlist"
                className="block rounded-2xl border border-primary/10 px-5 py-4 font-body text-primary transition hover:bg-background"
              >
                My Wishlist
              </Link>

              <Link
                to="/shop"
                className="block rounded-2xl border border-primary/10 px-5 py-4 font-body text-primary transition hover:bg-background"
              >
                Continue Shopping
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-2xl bg-primary px-5 py-4 text-left font-body text-white transition hover:bg-[#4E3829]"
              >
                Logout
              </button>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="overflow-hidden rounded-[30px] bg-white shadow-lg">
              <div className="border-b border-primary/10 px-6 py-5">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  My Orders
                </h2>

                <p className="mt-1 font-body text-sm text-[#75695F]">
                  Your latest Tashekari orders.
                </p>
              </div>

              {loadingOrders ? (
                <div className="px-6 py-12 text-center font-body text-[#75695F]">
                  Loading your orders...
                </div>
              ) : error ? (
                <div className="m-6 rounded-2xl bg-red-50 px-5 py-4 font-body text-red-600">
                  {error}
                </div>
              ) : orders.length === 0 ? (
                <div className="px-6 py-14 text-center">
                  <h3 className="font-heading text-3xl text-primary">
                    No Orders Yet
                  </h3>

                  <p className="mt-3 font-body text-sm text-[#75695F]">
                    Your orders will appear here after checkout.
                  </p>

                  <Link
                    to="/shop"
                    className="mt-6 inline-block rounded-full bg-primary px-6 py-3 font-body text-white transition hover:bg-[#4E3829]"
                  >
                    Explore Products
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-primary/10">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-6"
                    >
                      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary">
                            Order
                          </p>

                          <p className="mt-2 break-all font-body text-sm font-semibold text-primary">
                            {order.id}
                          </p>

                          <p className="mt-2 font-body text-sm text-[#75695F]">
                            {order.created_at
                              ? new Date(
                                  order.created_at
                                ).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "—"}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                          <div>
                            <p className="font-body text-xs text-[#817267]">
                              Amount
                            </p>

                            <p className="mt-1 font-body font-semibold text-primary">
                              ₹
                              {Number(
                                order.amount || 0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="font-body text-xs text-[#817267]">
                              Payment
                            </p>

                            <p className="mt-1 font-body capitalize text-primary">
                              {order.payment_method ||
                                "—"}
                            </p>
                          </div>

                          <div>
                            <p className="font-body text-xs text-[#817267]">
                              Payment Status
                            </p>

                            <span
                              className={`mt-1 inline-block rounded-full px-3 py-1 font-body text-xs ${
                                order.payment_status ===
                                "paid"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {order.payment_status ||
                                "pending"}
                            </span>
                          </div>

                          <div>
                            <p className="font-body text-xs text-[#817267]">
                              Order Status
                            </p>

                            <span
                              className={`mt-1 inline-block rounded-full px-3 py-1 font-body text-xs ${
                                order.status ===
                                "Delivered"
                                  ? "bg-green-100 text-green-700"
                                  : order.status ===
                                    "Shipped"
                                  ? "bg-blue-100 text-blue-700"
                                  : order.status ===
                                    "Packed"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : order.status ===
                                    "Cancelled"
                                  ? "bg-gray-200 text-gray-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {order.status ||
                                "Pending"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {(order.courier_name ||
                        order.tracking_number) && (
                        <div className="mt-5 grid gap-3 rounded-2xl bg-background p-4 font-body text-sm sm:grid-cols-2">
                          <p className="text-[#75695F]">
                            Courier:{" "}
                            <span className="font-medium text-primary">
                              {order.courier_name ||
                                "—"}
                            </span>
                          </p>

                          <p className="text-[#75695F]">
                            Tracking:{" "}
                            <span className="font-medium text-primary">
                              {order.tracking_number ||
                                "—"}
                            </span>
                          </p>
                        </div>
                      )}
                      <div className="mt-5 flex justify-end">
  <Link
    to={`/account/orders/${order.id}`}
    className="rounded-full bg-primary px-6 py-3 font-body text-sm font-medium text-white transition hover:bg-[#4E3829]"
  >
    View Order Details
  </Link>
</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}