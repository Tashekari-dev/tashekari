import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { supabase } from "../../lib/supabase";

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("product_reviews")
          .select(
            `
              id,
              customer_name,
              rating,
              review_text,
              created_at
            `
          )
          .eq("approved", true)
          .order("created_at", {
            ascending: false,
          })
          .limit(3);

        if (error) {
          throw error;
        }

        setReviews(data || []);
      } catch (error) {
        console.error(
          "Homepage testimonials error:",
          error
        );

        setReviews([]);
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, []);

  return (
    <section className="bg-background py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          viewport={{
            once: true,
          }}
          className="text-center"
        >
          <p className="text-sm uppercase tracking-[0.35em] text-secondary">
            Customer Love
          </p>

          <h2 className="mt-5 font-heading text-5xl font-bold text-primary md:text-6xl">
            What Our Customers Say
          </h2>
        </motion.div>

        {loading ? (
          <div className="mt-16 text-center">
            <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />

            <p className="mt-4 font-body text-[#817267]">
              Loading customer reviews...
            </p>
          </div>
        ) : reviews.length === 0 ? (
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            viewport={{
              once: true,
            }}
            className="mx-auto mt-16 max-w-2xl rounded-[30px] bg-white px-8 py-14 text-center shadow-lg"
          >
            <div className="text-5xl">
              ☆
            </div>

            <h3 className="mt-6 font-heading text-3xl font-semibold text-primary">
              No Customer Reviews Yet
            </h3>

            <p className="mt-4 font-body leading-7 text-[#817267]">
              Be the first customer to share your
              experience with Tashekari after receiving
              your order.
            </p>
          </motion.div>
        ) : (
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {reviews.map((review, index) => (
              <motion.article
                key={review.id}
                initial={{
                  opacity: 0,
                  y: 50,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.12,
                }}
                viewport={{
                  once: true,
                }}
                className="flex h-full flex-col rounded-[30px] bg-white p-8 shadow-lg transition duration-500 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div
                  className="flex text-2xl"
                  aria-label={`${Number(
                    review.rating || 0
                  )} out of 5 stars`}
                >
                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <span
                        key={star}
                        className={
                          star <=
                          Number(
                            review.rating || 0
                          )
                            ? "text-secondary"
                            : "text-gray-300"
                        }
                      >
                        ★
                      </span>
                    )
                  )}
                </div>

                <p className="mt-6 flex-1 font-body leading-8 text-gray-600">
                  “{review.review_text}”
                </p>

                <div className="mt-8 border-t border-primary/10 pt-5">
                  <h3 className="font-heading text-2xl font-bold text-primary">
                    {review.customer_name ||
                      "Tashekari Customer"}
                  </h3>

                  <p className="mt-1 font-body text-sm text-gray-400">
                    Verified Customer
                  </p>

                  {review.created_at && (
                    <p className="mt-2 font-body text-xs text-[#918277]">
                      {new Date(
                        review.created_at
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </p>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}