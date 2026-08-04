import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import InvoiceButton from "../components/common/InvoiceButton";
import { supabase } from "../lib/supabase";
import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useAuth } from "../context/AuthContext";

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
  const { addMultipleToCart } = useCart();

  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [error, setError] = useState("");
  const [cancellingOrder, setCancellingOrder] = useState(false);
  const [reviewingItem, setReviewingItem] = useState(null);
const [reviewRating, setReviewRating] = useState(5);
const [reviewText, setReviewText] = useState("");
const [submittingReview, setSubmittingReview] = useState(false);
const [submittedProductIds, setSubmittedProductIds] = useState([]);

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
  useEffect(() => {
  async function fetchSubmittedReviews() {
    if (!user?.id || !order?.id) {
      return;
    }

    try {
      const { data, error: reviewsError } = await supabase
        .from("product_reviews")
        .select("product_id")
        .eq("order_id", order.id)
        .eq("user_id", user.id);

      if (reviewsError) {
        throw reviewsError;
      }

      setSubmittedProductIds(
        (data || []).map((review) =>
          String(review.product_id)
        )
      );
    } catch (reviewsError) {
      console.error(
        "Submitted reviews load error:",
        reviewsError
      );
    }
  }

  fetchSubmittedReviews();
}, [user, order?.id]);

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
    function handleBuyAgain() {
  addMultipleToCart(items);

  navigate("/cart");
}

async function handleCancelOrder() {
  const confirmed = window.confirm(
    "Are you sure you want to cancel this order?"
  );

  if (!confirmed) return;

  try {
    setCancellingOrder(true);

    const { error: cancelError } = await supabase.rpc(
      "cancel_customer_order",
      {
        p_order_id: order.id,
      }
    );

    if (cancelError) throw cancelError;

    setOrder((currentOrder) => ({
      ...currentOrder,
      status: "Cancelled",
    }));

    toast.dismiss();
    toast.success("Order cancelled successfully.");
  } catch (cancelError) {
    console.error("Cancel order error:", cancelError);

    toast.dismiss();
    toast.error(
      cancelError?.message || "Unable to cancel this order."
    );
  } finally {
    setCancellingOrder(false);
  }
}
function openReviewForm(item) {
  setReviewingItem(item);
  setReviewRating(5);
  setReviewText("");
}

function closeReviewForm() {
  if (submittingReview) return;

  setReviewingItem(null);
  setReviewRating(5);
  setReviewText("");
}

async function handleSubmitReview(event) {
  event.preventDefault();

  if (!reviewingItem?.id) {
    toast.dismiss();
    toast.error("Product information is missing.");
    return;
  }

  const cleanReview = reviewText.trim();

  if (reviewRating < 1 || reviewRating > 5) {
    toast.dismiss();
    toast.error("Please select a rating.");
    return;
  }

  if (cleanReview.length < 5) {
    toast.dismiss();
    toast.error(
      "Please write at least 5 characters."
    );
    return;
  }

  try {
    setSubmittingReview(true);
    toast.dismiss();

    const { data, error: reviewError } =
      await supabase.rpc(
        "submit_product_review",
        {
          p_order_id: order.id,
          p_product_id: String(
            reviewingItem.id
          ),
          p_rating: reviewRating,
          p_review_text: cleanReview,
        }
      );

    if (reviewError) {
      throw reviewError;
    }

    if (!data?.success) {
      throw new Error(
        data?.message ||
          "Review could not be submitted."
      );
    }

    setSubmittedProductIds((currentIds) => [
      ...new Set([
        ...currentIds,
        String(reviewingItem.id),
      ]),
    ]);

    closeReviewForm();

    toast.success(
      data.message ||
        "Review submitted successfully."
    );
  } catch (reviewError) {
    console.error(
      "Review submission error:",
      reviewError
    );

    toast.dismiss();
    toast.error(
      reviewError?.message ||
        "Unable to submit your review."
    );
  } finally {
    setSubmittingReview(false);
  }
}

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
                          {String(currentStatus).toLowerCase() ===
  "delivered" && (
  <div className="mt-4">
    {submittedProductIds.includes(
      String(item.id)
    ) ? (
      <span className="inline-block rounded-full bg-green-100 px-4 py-2 font-body text-xs font-medium text-green-700">
        Review Submitted
      </span>
    ) : (
      <button
        type="button"
        onClick={() => openReviewForm(item)}
        className="rounded-full border border-primary px-5 py-2.5 font-body text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
      >
        Write a Review
      </button>
    )}
  </div>
)}
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

                  {order.tracking_number && (
  <a
    href={`https://www.delhivery.com/track-v2/package/${order.tracking_number}`}
    target="_blank"
    rel="noreferrer"
    className="mt-5 block w-full rounded-full border border-[#6B4F3A] px-6 py-3 text-center font-body font-medium text-[#6B4F3A] transition hover:bg-[#6B4F3A] hover:text-white"
  >
    Track Shipment
  </a>
)}

                </div>
              </div>
            </div>

            <div className="rounded-[30px] bg-white p-6 shadow-lg">
  <h2 className="font-heading text-3xl font-semibold text-primary">
    Invoice
  </h2>

  <p className="mt-2 font-body text-sm text-[#75695F]">
    Download your order invoice for your records.
  </p>

  <div className="mt-6">
    <InvoiceButton order={order} />
  </div>
</div>
{items.length > 0 && (
  <div className="mt-4">
    <button
      type="button"
      onClick={handleBuyAgain}
      className="w-full rounded-full bg-[#6B4F3A] px-6 py-3 font-body font-medium text-white transition hover:bg-[#4E3829]"
    >
      Buy Again
    </button>
  </div>
)}

{["pending", "packed"].includes(
  String(order.status || "Pending").toLowerCase()
) && (
  <button
    type="button"
    onClick={handleCancelOrder}
    disabled={cancellingOrder}
    className="w-full rounded-full border border-red-500 px-6 py-3 font-body font-medium text-red-500 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
  >
    {cancellingOrder ? "Cancelling..." : "Cancel Order"}
  </button>
)}


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
      {reviewingItem && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
    <div className="w-full max-w-lg rounded-[30px] bg-white p-6 shadow-2xl sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-body text-xs uppercase tracking-[0.25em] text-secondary">
            Product Review
          </p>

          <h2 className="mt-3 font-heading text-3xl font-semibold text-primary">
            {reviewingItem.name ||
              "Tashekari Product"}
          </h2>
        </div>

        <button
          type="button"
          onClick={closeReviewForm}
          disabled={submittingReview}
          className="text-3xl leading-none text-gray-400 transition hover:text-primary disabled:cursor-not-allowed"
          aria-label="Close review form"
        >
          ×
        </button>
      </div>

      <form
        onSubmit={handleSubmitReview}
        className="mt-7"
      >
        <p className="font-body text-sm font-medium text-primary">
          Your Rating
        </p>

        <div className="mt-3 flex gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() =>
                setReviewRating(rating)
              }
              className={`text-4xl transition ${
                rating <= reviewRating
                  ? "text-yellow-500"
                  : "text-gray-300"
              }`}
              aria-label={`${rating} star rating`}
            >
              ★
            </button>
          ))}
        </div>

        <label className="mt-7 block font-body text-sm font-medium text-primary">
          Your Review
        </label>

        <textarea
          value={reviewText}
          onChange={(event) =>
            setReviewText(event.target.value)
          }
          rows={5}
          maxLength={1000}
          placeholder="Share your experience with this handmade product..."
          className="mt-3 w-full resize-none rounded-2xl border border-primary/15 bg-background px-5 py-4 font-body text-primary outline-none transition focus:border-primary"
        />

        <div className="mt-2 flex justify-between font-body text-xs text-[#817267]">
          <span>Minimum 5 characters</span>
          <span>{reviewText.length}/1000</span>
        </div>

        <button
          type="submit"
          disabled={submittingReview}
          className="mt-7 w-full rounded-full bg-primary px-6 py-4 font-body font-medium text-white transition hover:bg-[#4E3829] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submittingReview
            ? "Submitting Review..."
            : "Submit Review"}
        </button>
      </form>
    </div>
  </div>
)}
    </>
  );
}