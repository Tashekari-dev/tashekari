import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/common/ProductCard";

import { products } from "../data/products";

export default function Shop() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  const categories = ["All", "Bags", "Keychains", "Accessories", "Bookmarks"];

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sortBy === "low-to-high") {
      return [...result].sort(
        (a, b) =>
          Number(String(a.price).replace(/[₹,]/g, "")) -
          Number(String(b.price).replace(/[₹,]/g, ""))
      );
    }

    if (sortBy === "high-to-low") {
      return [...result].sort(
        (a, b) =>
          Number(String(b.price).replace(/[₹,]/g, "")) -
          Number(String(a.price).replace(/[₹,]/g, ""))
      );
    }

    if (sortBy === "name") {
      return [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [search, category, sortBy]);

  return (
    <>
      <Navbar />

      <main className="bg-background">
        <section className="border-b border-primary/10 px-6 pb-16 pt-36 text-center lg:px-10">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-body text-xs uppercase tracking-[0.4em] text-secondary"
          >
            Handmade Collections
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="mt-5 font-heading text-6xl font-semibold text-primary md:text-7xl"
          >
            Shop Tashekari
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="mx-auto mt-5 max-w-2xl font-body leading-8 text-[#75695F]"
          >
            Explore thoughtfully handcrafted macrame pieces made for everyday
            beauty, meaningful gifting and warm living.
          </motion.p>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="rounded-[32px] border border-primary/10 bg-background p-5 shadow-sm md:p-7">
              <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="relative">
                  <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-lg text-secondary">
                    ⌕
                  </span>

                  <input
                    type="text"
                    placeholder="Search handmade products..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="w-full rounded-full border border-primary/15 bg-white py-4 pl-12 pr-6 font-body text-primary outline-none transition placeholder:text-[#9A8D83] focus:border-secondary"
                  />
                </div>

                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="w-full rounded-full border border-primary/15 bg-white px-6 py-4 font-body text-sm text-primary outline-none lg:w-[220px]"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="low-to-high">Price: Low to High</option>
                  <option value="high-to-low">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`rounded-full border px-6 py-3 font-body text-sm transition duration-300 ${
                      category === item
                        ? "border-primary bg-primary text-white shadow-md"
                        : "border-primary/15 bg-white text-primary hover:border-primary hover:bg-primary hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-3 border-b border-primary/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-body text-sm text-[#75695F]">
                Showing{" "}
                <span className="font-semibold text-primary">
                  {filteredProducts.length}
                </span>{" "}
                products
              </p>

              {(search || category !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                    setSortBy("featured");
                  }}
                  className="w-fit font-body text-sm font-medium text-secondary transition hover:text-primary"
                >
                  Clear filters
                </button>
              )}
            </div>

            {filteredProducts.length > 0 ? (
              <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 35 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: Math.min(index * 0.06, 0.3),
                    }}
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
            ) : (
              <div className="mt-12 rounded-[32px] bg-background px-6 py-20 text-center">
                <h2 className="font-heading text-4xl font-semibold text-primary">
                  No products found
                </h2>

                <p className="mt-4 font-body text-[#75695F]">
                  Try changing your search or category.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                    setSortBy("featured");
                  }}
                  className="mt-7 rounded-full bg-primary px-8 py-4 font-body text-sm font-medium text-white transition hover:bg-[#4E3829]"
                >
                  View All Products
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}