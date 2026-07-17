import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import { getFeaturedProducts } from "../../services/productService.js";
import { products as localProducts } from "../../data/products";
import ProductCard from "../common/ProductCard";

export default function FeaturedProducts() {
  const sliderRef = useRef(null);

  const [products, setProducts] = useState(localProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    async function fetchProducts() {
  try {
    const featuredProducts = await getFeaturedProducts();

    setProducts(featuredProducts);
  } catch (error) {
    console.error("Featured products error:", error);
  } finally {
    setLoading(false);
  }
}

    fetchProducts();
  }, []);

  const featuredProducts = products.filter(
    (product) => product.featured
  );

  function scrollSlider(direction) {
    if (!sliderRef.current) return;

    const scrollAmount = sliderRef.current.clientWidth * 0.85;

    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }

  return (
    <section className="overflow-hidden bg-background py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="font-body text-xs uppercase tracking-[0.38em] text-secondary">
              Customer Favourites
            </p>

            <h2 className="mt-5 font-heading text-5xl font-semibold text-primary md:text-6xl">
              Best Sellers
            </h2>

            <p className="mt-5 max-w-2xl font-body leading-8 text-[#75695F]">
              Discover handcrafted pieces loved for their detail, warmth and
              timeless character.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollSlider("left")}
              aria-label="View previous products"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 text-primary transition duration-300 hover:-translate-y-1 hover:bg-primary hover:text-white"
            >
              <FaArrowLeft size={15} />
            </button>

            <button
              type="button"
              onClick={() => scrollSlider("right")}
              aria-label="View next products"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-[#4E3829]"
            >
              <FaArrowRight size={15} />
            </button>

            <Link
              to="/shop"
              className="ml-2 hidden rounded-full border border-primary px-7 py-3 font-body text-sm font-medium text-primary transition duration-300 hover:bg-primary hover:text-white sm:block"
            >
              View All
            </Link>
          </div>
        </motion.div>

        {loading ? (
          <div className="mt-14 flex min-h-80 items-center justify-center">
            <p className="font-body text-sm text-[#75695F]">
              Loading products...
            </p>
          </div>
        ) : (
          <div
            ref={sliderRef}
            className="mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 45 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                }}
                viewport={{ once: true }}
                className="min-w-[86%] snap-start sm:min-w-[47%] lg:min-w-[31.5%]"
              >
                <ProductCard
                  id={product.id}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  category={product.category}
                  bestseller={product.bestseller}
                />
              </motion.div>
            ))}
          </div>
        )}

        <Link
          to="/shop"
          className="mx-auto mt-2 block w-fit rounded-full border border-primary px-8 py-4 font-body text-sm font-medium text-primary transition hover:bg-primary hover:text-white sm:hidden"
        >
          View All Products
        </Link>
      </div>
    </section>
  );
}