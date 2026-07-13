import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeartBroken, FaTrash } from "react-icons/fa";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

export default function Wishlist() {
  const {
    wishlistItems,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  function moveToCart(product) {
    addToCart(product);
    removeFromWishlist(product.id);
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background pt-28">
        <section className="border-b border-primary/10 px-6 py-14 text-center">
          <p className="font-body text-xs uppercase tracking-[0.4em] text-secondary">
            Saved For Later
          </p>

          <h1 className="mt-5 font-heading text-6xl font-semibold text-primary">
            Your Wishlist
          </h1>

          <p className="mt-4 font-body text-[#75695F]">
            {wishlistItems.length}{" "}
            {wishlistItems.length === 1 ? "product" : "products"} saved
          </p>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            {wishlistItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[40px] bg-white px-6 py-24 text-center shadow-lg"
              >
                <FaHeartBroken className="mx-auto text-6xl text-secondary" />

                <h2 className="mt-7 font-heading text-5xl font-semibold text-primary">
                  Your Wishlist is Empty
                </h2>

                <p className="mx-auto mt-5 max-w-lg font-body leading-8 text-[#75695F]">
                  Save the handmade products you love and return to them anytime.
                </p>

                <Link
                  to="/shop"
                  className="mt-9 inline-block rounded-full bg-primary px-9 py-4 font-body font-medium text-white transition hover:-translate-y-1 hover:bg-[#4E3829]"
                >
                  Explore Collection
                </Link>
              </motion.div>
            ) : (
              <>
                <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-body text-sm text-[#75695F]">
                    Your favourite Tashekari pieces are saved here.
                  </p>

                  <button
                    type="button"
                    onClick={clearWishlist}
                    className="w-fit rounded-full border border-red-200 px-6 py-3 font-body text-sm text-red-500 transition hover:bg-red-500 hover:text-white"
                  >
                    Clear Wishlist
                  </button>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {wishlistItems.map((product, index) => (
                    <motion.article
                      key={product.id}
                      initial={{ opacity: 0, y: 35 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className="overflow-hidden rounded-[32px] bg-white shadow-lg"
                    >
                      <Link
                        to={`/product/${product.id}`}
                        className="group block overflow-hidden"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-[360px] w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      </Link>

                      <div className="p-6">
                        <p className="font-body text-xs uppercase tracking-[0.3em] text-secondary">
                          {product.category || "Handmade"}
                        </p>

                        <Link to={`/product/${product.id}`}>
                          <h2 className="mt-3 font-heading text-3xl font-semibold text-primary transition hover:text-secondary">
                            {product.name}
                          </h2>
                        </Link>

                        <p className="mt-4 font-body text-xl font-semibold text-primary">
                          {product.price}
                        </p>

                        <div className="mt-7 flex flex-col gap-3">
                          <button
                            type="button"
                            onClick={() => moveToCart(product)}
                            className="w-full rounded-full bg-primary py-4 font-body font-medium text-white transition hover:-translate-y-1 hover:bg-[#4E3829]"
                          >
                            Move To Cart
                          </button>

                          <button
                            type="button"
                            onClick={() => removeFromWishlist(product.id)}
                            className="flex w-full items-center justify-center gap-2 rounded-full border border-primary/15 py-4 font-body text-sm text-primary transition hover:border-red-300 hover:text-red-500"
                          >
                            <FaTrash size={14} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}