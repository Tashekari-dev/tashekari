import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";

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
  const { toggleWishlist, isInWishlist } = useWishlist();

  const product = {
    id,
    image,
    name,
    price,
    category,
    bestseller,
  };

  const liked = isInWishlist(id);

  function handleWishlist(event) {
    event.preventDefault();
    event.stopPropagation();
    toggleWishlist(product);
  }

  return (
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
            liked ? "Remove product from wishlist" : "Add product to wishlist"
          }
          className="absolute right-5 top-5 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/90 shadow-lg backdrop-blur-md transition duration-300 hover:scale-110"
        >
          {liked ? (
            <FaHeart className="text-red-500" size={18} />
          ) : (
            <FaRegHeart className="text-primary" size={18} />
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
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                addToCart(product);
              }}
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
            >
              Add to Cart
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

        <div className="mt-5 flex items-center justify-between">
          <p className="text-xl font-semibold text-primary">{price}</p>

          <span className="text-sm text-[#8A7B70]">Handmade</span>
        </div>
      </div>
    </div>
  );
}