import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  FaCheck,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";

import { supabase } from "../../lib/supabase";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export default function ProductCard({
  id,
  image,
  name,
  price,
  category = "Handmade",
  bestseller = false,
}) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } =
    useWishlist();

  const [added, setAdded] = useState(false);
  const [showToast, setShowToast] =
    useState(false);
  const [reviews, setReviews] = useState([]);

  const toastTimer = useRef(null);
  const buttonTimer = useRef(null);

  const product = useMemo(
    () => ({
      id,
      image,
      name,
      price,
      category,
      bestseller,
    }),
    [
      id,
      image,
      name,
      price,
      category,
      bestseller,
    ]
  );

  const liked = isInWishlist(id);

  useEffect(() => {
    return () => {
      clearTimeout(toastTimer.current);
      clearTimeout(buttonTimer.current);
    };
  }, []);

  useEffect(() => {
    async function loadReviews() {
      if (!id) {
        setReviews([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("product_reviews")
          .select("rating")
          .eq("product_id", String(id))
          .eq("approved", true);

        if (error) {
          throw error;
        }

        setReviews(data || []);
      } catch (error) {
        console.error(
          "Product card reviews error:",
          error
        );

        setReviews([]);
      }
    }

    loadReviews();
  }, [id]);

  const reviewCount = reviews.length;

  const averageRating = useMemo(() => {
    if (reviewCount === 0) {
      return 0;
    }

    const totalRating = reviews.reduce(
      (sum, review) =>
        sum + Number(review.rating || 0),
      0
    );

    return totalRating / reviewCount;
  }, [reviews, reviewCount]);

  function handleWishlist(event) {
    event.preventDefault();
    event.stopPropagation();

    toggleWishlist(product);
  }

  function handleAddToCart(event) {
    event.preventDefault();
    event.stopPropagation();

    addToCart(product);

    setAdded(true);
    setShowToast(true);

    clearTimeout(toastTimer.current);
    clearTimeout(buttonTimer.current);

    toastTimer.current = setTimeout(() => {
      setShowToast(false);
    }, 3500);

    buttonTimer.current = setTimeout(() => {
      setAdded(false);
    }, 1800);
  }

  return (
    <>
      <div className="group overflow-hidden rounded-[30px] bg-white shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
        <div className="relative overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-[360px] w-full object-cover transition duration-700 group-hover:scale-110"
          />

          <button
            type="button"
            onClick={handleWishlist}
            aria-label={
              liked
                ? "Remove product from wishlist"
                : "Add product to wishlist"
            }
            className="absolute right-5 top-5 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/90 shadow-lg backdrop-blur-md transition duration-300 hover:scale-110"
          >
            {liked ? (
              <FaHeart
                className="text-red-500"
                size={18}
              />
            ) : (
              <FaRegHeart
                className="text-primary"
                size={18}
              />
            )}
          </button>

          {bestseller && (
            <span className="absolute left-5 top-5 z-20 rounded-full bg-primary px-4 py-2 text-xs uppercase tracking-[0.2em] text-white">
              Bestseller
            </span>
          )}

          <div className="absolute inset-0 z-10 flex items-end justify-center bg-black/30 opacity-0 transition duration-500 group-hover:opacity-100">
            <div className="mb-6 flex gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex min-w-[135px] items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition ${
                  added
                    ? "bg-green-600 text-white"
                    : "bg-white text-primary hover:bg-primary hover:text-white"
                }`}
              >
                {added ? (
                  <>
                    <FaCheck size={13} />
                    Added
                  </>
                ) : (
                  "Add to Cart"
                )}
              </button>

              <Link
                to={`/product/${id}`}
                className="rounded-full border border-white px-6 py-3 text-sm text-white transition hover:bg-white hover:text-primary"
              >
                View
              </Link>
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-secondary">
            {category}
          </p>

          <Link to={`/product/${id}`}>
            <h3 className="mt-3 font-heading text-2xl font-semibold text-primary transition hover:text-secondary">
              {name}
            </h3>
          </Link>

          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xl font-semibold text-primary">
                {price}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <div
                  className="flex text-sm"
                  aria-label={`${averageRating.toFixed(
                    1
                  )} out of 5 stars`}
                >
                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <span
                        key={star}
                        className={
                          star <=
                          Math.round(
                            averageRating
                          )
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }
                      >
                        ★
                      </span>
                    )
                  )}
                </div>

                <span className="font-body text-xs text-[#8A7B70]">
                  {reviewCount > 0
                    ? `${averageRating.toFixed(
                        1
                      )} (${reviewCount})`
                    : "No reviews"}
                </span>
              </div>
            </div>

            <span className="text-sm text-[#8A7B70]">
              Handmade
            </span>
          </div>
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-6 right-4 z-[9999] w-[calc(100%-2rem)] max-w-sm rounded-[24px] border border-primary/10 bg-white p-5 shadow-2xl sm:right-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
              <FaCheck size={17} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary">
                Added to Cart
              </p>

              <p className="mt-1 truncate font-heading text-xl font-semibold text-primary">
                {name}
              </p>

              <Link
                to="/cart"
                onClick={() =>
                  setShowToast(false)
                }
                className="mt-3 inline-block font-body text-sm font-semibold text-primary underline underline-offset-4 transition hover:text-secondary"
              >
                View Cart →
              </Link>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowToast(false)
              }
              aria-label="Close notification"
              className="text-xl text-[#8A7B70] transition hover:text-primary"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}