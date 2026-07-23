import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

const orderSteps = [
  "Pending",
  "Packed",
  "Shipped",
  "Delivered",
];

export default function CustomerOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, authLoading } = useAuth();

  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", {
        replace: true,
        state: {
          from: {
            pathname: `/account/orders/${id}`,
          },
        },
      });
    }
  }, [authLoading, user, navigate, id]);

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!user?.email || !id) {
        return;
      }

      try {
        setLoadingOrder(true);
        setError("");

        const { data, error: orderError } = await supabase
          .from("orders")
          .select(
            `
              id,
              customer_name,
              phone,
              email,
              address,
              city,
              state,
              pincode,
              items,
              amount,
              payment_method,
              payment_status,
              status,
              courier_name,
              tracking_number,
              razorpay_order_id,
              razorpay_payment_id,
              created_at
            `
          )
          .eq("id", id)
          .eq("email", user.email)
          .single();

        if (orderError) {
          throw orderError;
        }

        setOrder(data);
      } catch (fetchError) {
        console.error(
          "Customer order details error:",
          fetchError
        );

        setError(
          fetchError?.message ||
            "Unable to load this order."
        );
      } finally {
        setLoadingOrder(false);
      }
    }

    fetchOrderDetails();
  }, [user, id]);

  if (authLoading || loadingOrder) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="font-body text-primary">
          Loading order details...
        </p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  if (error || !order) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-background px-6 pb-20 pt-40">
          <div className="mx-auto max-w-2xl rounded-[30px] bg-white p-10 text-center shadow-lg">
            <h1 className="font-heading text-4xl text-primary">
              Order Not Found
            </h1>

            <p className="mt-4 font-body text-[#75695F]">
              {error ||
                "This order does not exist or does not belong to your account."}
            </p>

            <Link
              to="/account"
              className="mt-7 inline-block rounded-full bg-primary px-7 py-3 font-body text-white transition hover:bg-[#4E3829]"
            >
              Back To My Account
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  const currentStatus = order.status || "Pending";

  const currentStepIndex = orderSteps.indexOf(
    currentStatus
  );

  const items = Array.isArray(order.items)
    ? order.items
    : [];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background pb-20 pt-32">
        <section className="border-b border-primary/10 px-6 py-10">
          <div className="mx-auto max-w-7xl">
            <Link
              to="/account"
              className="font-body text-sm font-medium text-secondary transition hover:text-primary"
            >
              ← Back To My Account
            </Link>

            <p className="mt-7 font-body text-xs uppercase tracking-[0.35em] text-secondary">
              Order Details
            </p>

            <h1 className="mt-4 break-all font-heading text-4xl font-semibold text-primary sm:text-5xl">
              Order #{order.id}
            </h1>

            <p className="mt-3 font-body text-[#75695F]">
              Placed on{" "}
              {order.created_at
                ? new Date(
                    order.created_at
                  ).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                : "—"}
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1fr_360px] lg:px-10">
          <div className="space-y-8">
            <div className="rounded-[30px] bg-white p-6 shadow-lg sm:p-8">
              <h2 className="font-heading text-3xl font-semibold text-primary">
                Order Timeline
              </h2>

              <div className="mt-8 grid grid-cols-4">
                {orderSteps.map((step, index) => {
                  const completed =
                    currentStepIndex >= index;

                  return (
                    <div
                      key={step}
                      className="relative text-center"
                    >
                      {index < orderSteps.length - 1 && (
                        <div
                          className={`absolute left-1/2 top-4 h-1 w-full ${
                            currentStepIndex > index
                              ? "bg-green-500"
                              : "bg-gray-200"
                          }`}
                        />
                      )}

                      <div
                        className={`relative z-10 mx-auto flex h-9 w-9 items-center justify-center rounded-full font-body text-sm font-semibold ${
                          completed
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {completed ? "✓" : index + 1}
                      </div>

                      <p
                        className={`mt-3 font-body text-xs sm:text-sm ${
                          completed
                            ? "font-medium text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        {step}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="overflow-hidden rounded-[30px] bg-white shadow-lg">
              <div className="border-b border-primary/10 px-6 py-5">
                <h2 className="font-heading text-3xl font-semibold text-primary">
                  Ordered Products
                </h2>
              </div>

              {items.length === 0 ? (
                <div className="px-6 py-10 text-center font-body text-[#75695F]">
                  No product information found.
                </div>
              ) : (
                <div className="divide-y divide-primary/10">
                  {items.map((item, index) => {
                    const itemPrice = Number(
                      String(item.price || 0).replace(
                        /[₹,\s]/g,
                        ""
                      )
                    );

                    const quantity = Number(
                      item.quantity || 1
                    );

                    return (
                      <div
                        key={`${item.id || "item"}-${index}`}
                        className="flex gap-4 p-6"
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name || "Product"}
                            className="h-24 w-24 shrink-0 rounded-2xl object-cover"
                          />
                        )}

                        <div className="min-w-0 flex-1">
                          <h3 className="font-heading text-2xl font-semibold text-primary">
                            {item.name || "Tashekari Product"}
                          </h3>

                          <p className="mt-2 font-body text-sm text-[#75695F]">
                            Quantity: {quantity}
                          </p>

                          <p className="mt-3 font-body font-semibold text-secondary">
                            ₹
                            {(
                              itemPrice * quantity
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-[30px] bg-white p-6 shadow-lg sm:p-8">
              <h2 className="font-heading text-3xl font-semibold text-primary">
                Delivery Address
              </h2>

              <div className="mt-5 space-y-2 font-body leading-7 text-[#75695F]">
                <p className="font-semibold text-primary">
                  {order.customer_name || "Customer"}
                </p>

                <p>{order.phone || "—"}</p>

                <p>{order.email || "—"}</p>

                <p>
                  {[
                    order.address,
                    order.city,
                    order.state,
                    order.pincode,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </div>
          </div>

          <aside className="h-fit space-y-6 lg:sticky lg:top-32">
            <div className="rounded-[30px] bg-white p-6 shadow-lg">
              <h2 className="font-heading text-3xl font-semibold text-primary">
                Payment Summary
              </h2>

              <div className="mt-6 space-y-4 font-body">
                <div className="flex justify-between gap-4">
                  <span className="text-[#75695F]">
                    Total Amount
                  </span>

                  <span className="font-semibold text-primary">
                    ₹
                    {Number(
                      order.amount || 0
                    ).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-[#75695F]">
                    Payment Method
                  </span>

                  <span className="capitalize text-primary">
                    {order.payment_method || "—"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-[#75695F]">
                    Payment Status
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      order.payment_status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.payment_status || "pending"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-[#75695F]">
                    Order Status
                  </span>

                  <span className="rounded-full bg-background px-3 py-1 text-xs font-medium text-primary">
                    {currentStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] bg-white p-6 shadow-lg">
              <h2 className="font-heading text-3xl font-semibold text-primary">
                Shipping & Tracking
              </h2>

              <div className="mt-6 space-y-5 font-body">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-secondary">
                    Courier Partner
                  </p>

                  <p className="mt-2 font-medium text-primary">
                    {order.courier_name ||
                      "Not assigned yet"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-secondary">
                    Tracking Number
                  </p>

                  <p className="mt-2 break-all font-medium text-primary">
                    {order.tracking_number ||
                      "Not available yet"}
                  </p>
                </div>
              </div>
            </div>

            {order.payment_method === "online" && (
              <div className="rounded-[30px] bg-white p-6 shadow-lg">
                <h2 className="font-heading text-2xl font-semibold text-primary">
                  Payment Reference
                </h2>

                <div className="mt-5 space-y-4 font-body text-sm">
                  <div>
                    <p className="text-[#75695F]">
                      Razorpay Order ID
                    </p>

                    <p className="mt-1 break-all font-medium text-primary">
                      {order.razorpay_order_id || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[#75695F]">
                      Razorpay Payment ID
                    </p>

                    <p className="mt-1 break-all font-medium text-primary">
                      {order.razorpay_payment_id || "—"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </section>
      </main>

      <Footer />
    </>
  );
}