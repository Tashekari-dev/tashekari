import {
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";

import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabase";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] =
    useState(true);
  const [processingId, setProcessingId] =
    useState("");
  const [search, setSearch] =
    useState("");
  const [filter, setFilter] =
    useState("pending");

  useEffect(() => {
    fetchReviews();
  }, []);

  async function invokeReviewAction(
    action,
    reviewId = null
  ) {
    const { data, error } =
      await supabase.functions.invoke(
        "admin-reviews",
        {
          body: {
            action,
            reviewId,
          },
        }
      );

    if (error) {
      throw error;
    }

    if (!data?.success) {
      throw new Error(
        data?.message ||
          "Unable to manage reviews."
      );
    }

    return data;
  }

  async function fetchReviews() {
    try {
      setLoading(true);

      const data =
        await invokeReviewAction("list");

      setReviews(data.reviews || []);
    } catch (error) {
      console.error(
        "Reviews load error:",
        error
      );

      toast.dismiss();
      toast.error(
        error?.message ||
          "Reviews load nahi ho paye."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleApproval(review) {
    try {
      setProcessingId(review.id);

      const action = review.approved
        ? "unapprove"
        : "approve";

      const data =
        await invokeReviewAction(
          action,
          review.id
        );

      setReviews((currentReviews) =>
        currentReviews.map(
          (currentReview) =>
            currentReview.id === review.id
              ? {
                  ...currentReview,
                  approved:
                    !review.approved,
                }
              : currentReview
        )
      );

      toast.dismiss();
      toast.success(data.message);
    } catch (error) {
      console.error(
        "Review approval error:",
        error
      );

      toast.dismiss();
      toast.error(
        error?.message ||
          "Review update nahi hua."
      );
    } finally {
      setProcessingId("");
    }
  }

  async function handleDelete(review) {
    const confirmed = window.confirm(
      `Delete review from ${
        review.customer_name ||
        "this customer"
      }?`
    );

    if (!confirmed) return;

    try {
      setProcessingId(review.id);

      const data =
        await invokeReviewAction(
          "delete",
          review.id
        );

      setReviews((currentReviews) =>
        currentReviews.filter(
          (currentReview) =>
            currentReview.id !== review.id
        )
      );

      toast.dismiss();
      toast.success(data.message);
    } catch (error) {
      console.error(
        "Review delete error:",
        error
      );

      toast.dismiss();
      toast.error(
        error?.message ||
          "Review delete nahi hua."
      );
    } finally {
      setProcessingId("");
    }
  }

  const counts = useMemo(() => {
    return {
      all: reviews.length,
      pending: reviews.filter(
        (review) => !review.approved
      ).length,
      approved: reviews.filter(
        (review) => review.approved
      ).length,
    };
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return reviews.filter((review) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "approved" &&
          review.approved) ||
        (filter === "pending" &&
          !review.approved);

      const searchableText = [
        review.product_name,
        review.customer_name,
        review.customer_email,
        review.review_text,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query ||
        searchableText.includes(query);

      return (
        matchesFilter &&
        matchesSearch
      );
    });
  }, [reviews, search, filter]);

  function renderStars(rating) {
    return Array.from(
      { length: 5 },
      (_, index) => (
        <span
          key={index}
          className={
            index < Number(rating || 0)
              ? "text-yellow-500"
              : "text-gray-300"
          }
        >
          ★
        </span>
      )
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-7">
        <div>
          <h1 className="text-4xl font-bold text-[#6B4F3A]">
            Product Reviews
          </h1>

          <p className="mt-2 text-gray-500">
            Approve, hide or delete customer reviews.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Total Reviews",
              value: counts.all,
            },
            {
              label: "Pending",
              value: counts.pending,
            },
            {
              label: "Approved",
              value: counts.approved,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-3xl bg-white p-6 shadow-sm"
            >
              <p className="text-sm text-gray-500">
                {item.label}
              </p>

              <p className="mt-2 text-3xl font-bold text-[#6B4F3A]">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search product, customer or review..."
              className="w-full rounded-xl border border-[#E7D8CA] px-4 py-3 outline-none focus:border-[#6B4F3A]"
            />

            <select
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value)
              }
              className="rounded-xl border border-[#E7D8CA] bg-white px-4 py-3 text-[#6B4F3A] outline-none"
            >
              <option value="pending">
                Pending Reviews
              </option>

              <option value="approved">
                Approved Reviews
              </option>

              <option value="all">
                All Reviews
              </option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-white px-6 py-14 text-center shadow-sm">
            Loading reviews...
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="rounded-3xl bg-white px-6 py-14 text-center text-gray-500 shadow-sm">
            No reviews found.
          </div>
        ) : (
          <div className="space-y-5">
            {filteredReviews.map(
              (review) => (
                <article
                  key={review.id}
                  className="rounded-3xl bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-6 md:flex-row">
                    {review.product_image ? (
                      <img
                        src={
                          review.product_image
                        }
                        alt={
                          review.product_name
                        }
                        className="h-32 w-full rounded-2xl object-cover md:w-32"
                      />
                    ) : (
                      <div className="flex h-32 w-full items-center justify-center rounded-2xl bg-[#F8F5F1] text-sm text-gray-400 md:w-32">
                        No Image
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-[#A67C52]">
                            Product
                          </p>

                          <h2 className="mt-2 text-2xl font-semibold text-[#6B4F3A]">
                            {
                              review.product_name
                            }
                          </h2>
                        </div>

                        <span
                          className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                            review.approved
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {review.approved
                            ? "Approved"
                            : "Pending"}
                        </span>
                      </div>

                      <div className="mt-4 text-xl">
                        {renderStars(
                          review.rating
                        )}
                      </div>

                      <p className="mt-4 leading-7 text-gray-700">
                        {review.review_text}
                      </p>

                      <div className="mt-5 grid gap-3 rounded-2xl bg-[#F8F5F1] p-4 text-sm sm:grid-cols-2">
                        <p>
                          <span className="text-gray-500">
                            Customer:
                          </span>{" "}
                          <span className="font-medium text-[#6B4F3A]">
                            {
                              review.customer_name
                            }
                          </span>
                        </p>

                        <p className="break-all">
                          <span className="text-gray-500">
                            Email:
                          </span>{" "}
                          <span className="font-medium text-[#6B4F3A]">
                            {
                              review.customer_email
                            }
                          </span>
                        </p>

                        <p>
                          <span className="text-gray-500">
                            Order:
                          </span>{" "}
                          <span className="font-medium text-[#6B4F3A]">
                            {String(
                              review.order_id
                            ).slice(0, 8)}
                          </span>
                        </p>

                        <p>
                          <span className="text-gray-500">
                            Submitted:
                          </span>{" "}
                          <span className="font-medium text-[#6B4F3A]">
                            {review.created_at
                              ? new Date(
                                  review.created_at
                                ).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "—"}
                          </span>
                        </p>
                      </div>

                      <div className="mt-5 flex flex-wrap justify-end gap-3">
                        <button
                          type="button"
                          disabled={
                            processingId ===
                            review.id
                          }
                          onClick={() =>
                            handleApproval(review)
                          }
                          className={`rounded-xl px-5 py-2.5 font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                            review.approved
                              ? "bg-gray-500 hover:bg-gray-600"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {processingId ===
                          review.id
                            ? "Processing..."
                            : review.approved
                            ? "Move To Pending"
                            : "Approve Review"}
                        </button>

                        <button
                          type="button"
                          disabled={
                            processingId ===
                            review.id
                          }
                          onClick={() =>
                            handleDelete(review)
                          }
                          className="rounded-xl bg-red-500 px-5 py-2.5 font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}