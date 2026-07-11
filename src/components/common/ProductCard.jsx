import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function ProductCard({
  id,
  image,
  name,
  price,
  category = "Handmade",
  bestseller = false,
}) {
  const { addToCart } = useCart();

  const [isFavourite, setIsFavourite] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const product = {
    id,
    image,
    name,
    price,
    category,
    bestseller,
  };

  function handleAddToCart() {
    addToCart(product);
    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[32px] border border-primary/10 bg-white shadow-[0_12px_35px_rgba(107,79,58,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_55px_rgba(107,79,58,0.16)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-cream">
        <Link
          to={`/product/${id}`}
          aria-label={`View ${name}`}
          className="block h-full w-full"
        >
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {bestseller && (
          <span className="absolute left-5 top-5 rounded-full bg-primary px-4 py-2 font-body text-[10px] font-medium uppercase tracking-[0.24em] text-white shadow-lg">
            Bestseller
          </span>
        )}

        <button
          type="button"
          onClick={() => setIsFavourite((current) => !current)}
          aria-label={
            isFavourite ? "Remove from wishlist" : "Add to wishlist"
          }
          className={`absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/60 text-xl shadow-lg backdrop-blur-md transition duration-300 hover:scale-110 ${
            isFavourite
              ? "bg-primary text-white"
              : "bg-white/90 text-primary"
          }`}
        >
          {isFavourite ? "♥" : "♡"}
        </button>

        <div className="absolute inset-x-0 bottom-0 flex translate-y-full justify-center gap-3 p-5 transition-transform duration-500 group-hover:translate-y-0">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`rounded-full px-5 py-3 font-body text-xs font-medium shadow-lg transition duration-300 ${
              isAdded
                ? "bg-secondary text-white"
                : "bg-white text-primary hover:bg-primary hover:text-white"
            }`}
          >
            {isAdded ? "Added ✓" : "Add to Cart"}
          </button>

          <Link
            to={`/product/${id}`}
            className="rounded-full border border-white bg-black/20 px-5 py-3 font-body text-xs font-medium text-white backdrop-blur-md transition duration-300 hover:bg-white hover:text-primary"
          >
            Quick View
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="font-body text-[10px] font-medium uppercase tracking-[0.3em] text-secondary">
          {category}
        </p>

        <Link to={`/product/${id}`}>
          <h3 className="mt-3 line-clamp-2 font-heading text-2xl font-semibold leading-tight text-primary transition duration-300 hover:text-secondary">
            {name}
          </h3>
        </Link>

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <p className="font-body text-xl font-semibold text-primary">
            {price}
          </p>

          <span className="font-body text-xs text-[#8A7B70]">
            Handmade
          </span>
        </div>
      </div>
    </article>
  );
}