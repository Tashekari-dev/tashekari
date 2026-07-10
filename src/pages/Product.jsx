import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import { products } from "../data/products";
import { useCart } from "../context/CartContext";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/common/ProductCard";

export default function Product() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = products.find((item) => item.id === Number(id));

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    return products
      .filter(
        (item) =>
          item.category === product.category && item.id !== product.id
      )
      .slice(0, 3);
  }, [product]);

  function handleAddToCart() {
    for (let count = 0; count < quantity; count += 1) {
      addToCart(product);
    }

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1800);
  }

  if (!product) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-screen items-center justify-center bg-background px-6 pt-28 text-center">
          <div>
            <p className="font-body text-sm uppercase tracking-[0.35em] text-secondary">
              Tashekari
            </p>

            <h1 className="mt-5 font-heading text-5xl font-semibold text-primary">
              Product Not Found
            </h1>

            <Link
              to="/shop"
              className="mt-8 inline-block rounded-full bg-primary px-8 py-4 font-body text-white transition hover:bg-[#4E3829]"
            >
              Back To Shop
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="bg-background pt-28">
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mb-8 flex flex-wrap items-center gap-2 font-body text-sm text-[#817267]">
              <Link to="/" className="transition hover:text-primary">
                Home
              </Link>

              <span>/</span>

              <Link to="/shop" className="transition hover:text-primary">
                Shop
              </Link>

              <span>/</span>

              <span className="text-primary">{product.name}</span>
            </div>

            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="relative"
              >
                <div className="absolute -left-10 -top-10 h-72 w-72 rounded-full bg-light/80 blur-[120px]" />

                <div className="relative overflow-hidden rounded-[40px] bg-white shadow-2xl">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-[540px] w-full object-cover transition duration-700 hover:scale-105 md:h-[700px]"
                  />

                  {product.bestseller && (
                    <span className="absolute left-6 top-6 rounded-full bg-primary px-5 py-2 font-body text-xs uppercase tracking-[0.2em] text-white shadow-lg">
                      Bestseller
                    </span>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="rounded-[40px] bg-white p-7 shadow-xl sm:p-10"
              >
                <p className="font-body text-xs uppercase tracking-[0.35em] text-secondary">
                  {product.category} Collection
                </p>

                <h1 className="mt-5 font-heading text-5xl font-semibold leading-tight text-primary md:text-6xl">
                  {product.name}
                </h1>

                <div className="mt-6 flex items-center gap-4">
                  <p className="font-heading text-4xl font-semibold text-secondary">
                    {product.price}
                  </p>

                  <span className="rounded-full bg-cream px-4 py-2 font-body text-xs text-primary">
                    In Stock
                  </span>
                </div>

                <div className="mt-5 text-secondary">
                  ★★★★★
                  <span className="ml-3 font-body text-sm text-[#817267]">
                    Handmade quality
                  </span>
                </div>

                <p className="mt-8 font-body text-base leading-8 text-[#6F6258]">
                  Carefully handcrafted using premium cotton cords and
                  sustainable materials. Each piece is made with patience,
                  creativity and attention to detail, making it perfect for
                  everyday use and thoughtful gifting.
                </p>

                <div className="mt-8 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-2xl bg-background p-4">
                    <p className="font-body text-sm font-semibold text-primary">
                      Handmade
                    </p>
                  </div>

                  <div className="rounded-2xl bg-background p-4">
                    <p className="font-body text-sm font-semibold text-primary">
                      Sustainable
                    </p>
                  </div>

                  <div className="rounded-2xl bg-background p-4">
                    <p className="font-body text-sm font-semibold text-primary">
                      Made With Love
                    </p>
                  </div>
                </div>

                <div className="mt-9">
                  <p className="font-body text-sm font-semibold text-primary">
                    Quantity
                  </p>

                  <div className="mt-3 flex w-fit items-center rounded-full border border-primary/15 bg-background p-1">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((current) => Math.max(1, current - 1))
                      }
                      className="flex h-11 w-11 items-center justify-center rounded-full font-body text-xl text-primary transition hover:bg-white"
                    >
                      −
                    </button>

                    <span className="w-12 text-center font-body font-semibold text-primary">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((current) => current + 1)
                      }
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-primary font-body text-xl text-white transition hover:bg-[#4E3829]"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`mt-9 w-full rounded-full py-5 font-body text-base font-medium text-white shadow-lg transition duration-300 hover:-translate-y-1 ${
                    added
                      ? "bg-secondary"
                      : "bg-primary hover:bg-[#4E3829]"
                  }`}
                >
                  {added ? "Added To Cart ✓" : "Add To Cart"}
                </button>

                <Link
                  to="/cart"
                  className="mt-4 block w-full rounded-full border border-primary py-5 text-center font-body text-base font-medium text-primary transition hover:bg-primary hover:text-white"
                >
                  View Cart
                </Link>

                <div className="mt-9 space-y-4 border-t border-primary/10 pt-7 font-body text-sm text-[#6F6258]">
                  <p>✓ Secure checkout</p>
                  <p>✓ Carefully packed handmade product</p>
                  <p>✓ Delivery available across India</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="bg-white py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
              <div className="text-center">
                <p className="font-body text-xs uppercase tracking-[0.35em] text-secondary">
                  You May Also Love
                </p>

                <h2 className="mt-5 font-heading text-5xl font-semibold text-primary">
                  Related Products
                </h2>
              </div>

              <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {relatedProducts.map((item) => (
                  <ProductCard
                    key={item.id}
                    id={item.id}
                    image={item.image}
                    name={item.name}
                    price={item.price}
                    category={item.category}
                    bestseller={item.bestseller}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}