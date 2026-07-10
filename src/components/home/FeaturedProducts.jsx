import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { products } from "../../data/products";
import ProductCard from "../common/ProductCard";

export default function FeaturedProducts() {
  const featuredProducts = products
    .filter((product) => product.featured)
    .slice(0, 6);

  return (
    <section className="bg-background py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
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

          <Link
            to="/shop"
            className="w-fit rounded-full border border-primary px-7 py-3 font-body text-sm font-medium text-primary transition duration-300 hover:bg-primary hover:text-white"
          >
            View All Products
          </Link>
        </motion.div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              viewport={{ once: true }}
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
      </div>
    </section>
  );
}