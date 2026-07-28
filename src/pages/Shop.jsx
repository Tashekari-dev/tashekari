import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FaFilter,
  FaSearch,
  FaSlidersH,
  FaTimes,
} from "react-icons/fa";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/common/ProductCard";

import { getProducts } from "../services/productService.js";
import { supabase } from "../lib/supabase";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [productCollections, setProductCollections] = useState([]);

  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [collectionId, setCollectionId] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  const [minimumPrice, setMinimumPrice] = useState("");
  const [maximumPrice, setMaximumPrice] = useState("");

  useEffect(() => {
    fetchShopData();
  }, []);

  async function fetchShopData() {
    try {
      setLoading(true);

      const [
        productData,
        collectionsResponse,
        mappingsResponse,
      ] = await Promise.all([
        getProducts(),

        supabase
          .from("collections")
          .select("id, name, slug")
          .eq("status", "Published")
          .eq("active", true)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false }),

        supabase
          .from("collection_products")
          .select("collection_id, product_id"),
      ]);

      if (collectionsResponse.error) {
        throw collectionsResponse.error;
      }

      if (mappingsResponse.error) {
        throw mappingsResponse.error;
      }

      setProducts(productData || []);
      setCollections(collectionsResponse.data || []);
      setProductCollections(mappingsResponse.data || []);
    } catch (error) {
      console.error("Shop data error:", error);

      setProducts([]);
      setCollections([]);
      setProductCollections([]);
    } finally {
      setLoading(false);
    }
  }

  function getNumericPrice(price) {
    return Number(String(price).replace(/[₹,\s]/g, "")) || 0;
  }

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [products]);

  const productCollectionMap = useMemo(() => {
    const map = new Map();

    productCollections.forEach((mapping) => {
      const productId = String(mapping.product_id);
      const currentCollections = map.get(productId) || [];

      currentCollections.push(String(mapping.collection_id));
      map.set(productId, currentCollections);
    });

    return map;
  }, [productCollections]);

  const collectionNameMap = useMemo(() => {
    return new Map(
      collections.map((collection) => [
        String(collection.id),
        collection.name,
      ])
    );
  }, [collections]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const minimum = minimumPrice === ""
      ? null
      : Number(minimumPrice);
    const maximum = maximumPrice === ""
      ? null
      : Number(maximumPrice);

    const result = products.filter((product) => {
      const price = getNumericPrice(product.price);

      const assignedCollectionIds =
        productCollectionMap.get(String(product.id)) || [];

      const assignedCollectionNames = assignedCollectionIds
        .map((id) => collectionNameMap.get(id) || "")
        .join(" ")
        .toLowerCase();

      const searchableText = [
        product.name,
        product.category,
        product.description,
        assignedCollectionNames,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      const matchesCategory =
        category === "All" ||
        product.category === category;

      const matchesCollection =
        collectionId === "All" ||
        assignedCollectionIds.includes(
          String(collectionId)
        );

      const matchesAvailability =
        availability === "All" ||
        (availability === "in-stock" &&
          Number(product.stock) > 0) ||
        (availability === "out-of-stock" &&
          Number(product.stock) <= 0);

      const matchesMinimumPrice =
        minimum === null || price >= minimum;

      const matchesMaximumPrice =
        maximum === null || price <= maximum;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesCollection &&
        matchesAvailability &&
        matchesMinimumPrice &&
        matchesMaximumPrice
      );
    });

    if (sortBy === "low-to-high") {
      return [...result].sort(
        (a, b) =>
          getNumericPrice(a.price) -
          getNumericPrice(b.price)
      );
    }

    if (sortBy === "high-to-low") {
      return [...result].sort(
        (a, b) =>
          getNumericPrice(b.price) -
          getNumericPrice(a.price)
      );
    }

    if (sortBy === "name") {
      return [...result].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    if (sortBy === "newest") {
      return [...result].sort(
        (a, b) =>
          new Date(b.created_at || 0) -
          new Date(a.created_at || 0)
      );
    }

    if (sortBy === "bestseller") {
      return [...result].sort((a, b) => {
        if (
          Boolean(a.bestseller) ===
          Boolean(b.bestseller)
        ) {
          return 0;
        }

        return a.bestseller ? -1 : 1;
      });
    }

    return [...result].sort((a, b) => {
      if (
        Boolean(a.featured) === Boolean(b.featured)
      ) {
        return 0;
      }

      return a.featured ? -1 : 1;
    });
  }, [
    products,
    search,
    category,
    collectionId,
    availability,
    minimumPrice,
    maximumPrice,
    sortBy,
    productCollectionMap,
    collectionNameMap,
  ]);

  const selectedCollection = collections.find(
    (collection) =>
      String(collection.id) === String(collectionId)
  );

  const activeFilters = [
    search && `Search: ${search}`,
    category !== "All" && category,
    selectedCollection?.name,
    availability === "in-stock" && "In Stock",
    availability === "out-of-stock" && "Out of Stock",
    minimumPrice !== "" && `Min ₹${minimumPrice}`,
    maximumPrice !== "" && `Max ₹${maximumPrice}`,
  ].filter(Boolean);

  function clearAllFilters() {
    setSearch("");
    setCategory("All");
    setCollectionId("All");
    setAvailability("All");
    setMinimumPrice("");
    setMaximumPrice("");
    setSortBy("featured");
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="border-b border-primary/10 px-6 pb-16 pt-40 text-center lg:px-10">
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
            transition={{
              duration: 0.65,
              delay: 0.1,
            }}
            className="mt-5 font-heading text-5xl font-semibold text-primary sm:text-6xl md:text-7xl"
          >
            Shop Tashekari
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.65,
              delay: 0.2,
            }}
            className="mx-auto mt-5 max-w-2xl font-body leading-8 text-[#75695F]"
          >
            Explore thoughtfully handcrafted macrame pieces
            made for everyday beauty, meaningful gifting and
            warm living.
          </motion.p>
        </section>

        <section className="bg-white py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            {/* Search and Sort */}
            <div className="rounded-[30px] border border-primary/10 bg-background p-5 shadow-sm sm:p-7">
              <div className="grid gap-4 lg:grid-cols-[1fr_240px_auto]">
                <div className="relative">
                  <FaSearch className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-secondary" />

                  <input
                    type="text"
                    placeholder="Search products, categories or collections..."
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    className="w-full rounded-full border border-primary/15 bg-white py-4 pl-12 pr-6 font-body text-primary outline-none transition placeholder:text-[#9A8D83] focus:border-secondary"
                  />
                </div>

                <select
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(event.target.value)
                  }
                  className="w-full rounded-full border border-primary/15 bg-white px-6 py-4 font-body text-sm text-primary outline-none"
                >
                  <option value="featured">
                    Sort: Featured
                  </option>

                  <option value="newest">
                    Sort: Newest
                  </option>

                  <option value="bestseller">
                    Sort: Bestselling
                  </option>

                  <option value="low-to-high">
                    Price: Low to High
                  </option>

                  <option value="high-to-low">
                    Price: High to Low
                  </option>

                  <option value="name">
                    Name: A to Z
                  </option>
                </select>

                <button
                  type="button"
                  onClick={() =>
                    setFiltersOpen((current) => !current)
                  }
                  className={`flex items-center justify-center gap-3 rounded-full border px-7 py-4 font-body text-sm font-medium transition ${
                    filtersOpen
                      ? "border-primary bg-primary text-white"
                      : "border-primary/15 bg-white text-primary hover:border-primary hover:bg-primary hover:text-white"
                  }`}
                >
                  {filtersOpen ? (
                    <FaTimes size={14} />
                  ) : (
                    <FaSlidersH size={14} />
                  )}

                  Filters
                </button>
              </div>

              {/* Expandable Filters */}
              <div
                className={`overflow-hidden transition-all duration-500 ${
                  filtersOpen
                    ? "mt-7 max-h-[1000px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="border-t border-primary/10 pt-7">
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {/* Collection */}
                    <div>
                      <label className="mb-2 block font-body text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                        Collection
                      </label>

                      <select
                        value={collectionId}
                        onChange={(event) =>
                          setCollectionId(event.target.value)
                        }
                        className="w-full rounded-2xl border border-primary/15 bg-white px-5 py-4 font-body text-sm text-primary outline-none focus:border-secondary"
                      >
                        <option value="All">
                          All Collections
                        </option>

                        {collections.map((collection) => (
                          <option
                            key={collection.id}
                            value={collection.id}
                          >
                            {collection.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Availability */}
                    <div>
                      <label className="mb-2 block font-body text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                        Availability
                      </label>

                      <select
                        value={availability}
                        onChange={(event) =>
                          setAvailability(event.target.value)
                        }
                        className="w-full rounded-2xl border border-primary/15 bg-white px-5 py-4 font-body text-sm text-primary outline-none focus:border-secondary"
                      >
                        <option value="All">
                          All Products
                        </option>

                        <option value="in-stock">
                          In Stock
                        </option>

                        <option value="out-of-stock">
                          Out of Stock
                        </option>
                      </select>
                    </div>

                    {/* Minimum Price */}
                    <div>
                      <label className="mb-2 block font-body text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                        Minimum Price
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={minimumPrice}
                        onChange={(event) =>
                          setMinimumPrice(event.target.value)
                        }
                        placeholder="₹0"
                        className="w-full rounded-2xl border border-primary/15 bg-white px-5 py-4 font-body text-sm text-primary outline-none placeholder:text-[#9A8D83] focus:border-secondary"
                      />
                    </div>

                    {/* Maximum Price */}
                    <div>
                      <label className="mb-2 block font-body text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                        Maximum Price
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={maximumPrice}
                        onChange={(event) =>
                          setMaximumPrice(event.target.value)
                        }
                        placeholder="₹5000"
                        className="w-full rounded-2xl border border-primary/15 bg-white px-5 py-4 font-body text-sm text-primary outline-none placeholder:text-[#9A8D83] focus:border-secondary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Buttons */}
              <div className="mt-7">
                <div className="mb-3 flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                  <FaFilter size={12} />
                  Categories
                </div>

                <div className="flex flex-wrap gap-3">
                  {categories.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCategory(item)}
                      className={`rounded-full border px-5 py-3 font-body text-sm transition duration-300 ${
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
            </div>

            {/* Active Filters */}
            <div className="mt-8 flex flex-col gap-5 border-b border-primary/10 pb-7 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-body text-sm text-[#75695F]">
                  Showing{" "}
                  <span className="font-semibold text-primary">
                    {filteredProducts.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-primary">
                    {products.length}
                  </span>{" "}
                  products
                </p>

                {activeFilters.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {activeFilters.map((filter) => (
                      <span
                        key={filter}
                        className="rounded-full bg-background px-4 py-2 font-body text-xs text-primary"
                      >
                        {filter}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {activeFilters.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="w-fit rounded-full border border-primary/15 px-5 py-3 font-body text-sm font-medium text-secondary transition hover:border-primary hover:bg-primary hover:text-white"
                >
                  Clear All Filters
                </button>
              )}
            </div>

            {/* Products */}
            {loading ? (
              <div className="mt-12 rounded-[32px] bg-background px-6 py-20 text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#E7D8CA] border-t-primary" />

                <p className="mt-5 font-body text-[#75695F]">
                  Loading products...
                </p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map(
                  (product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{
                        opacity: 0,
                        y: 35,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.5,
                        delay: Math.min(
                          index * 0.05,
                          0.3
                        ),
                      }}
                    >
                      <ProductCard
                        id={product.id}
                        image={product.image}
                        name={product.name}
                        price={product.price}
                        category={product.category}
                        bestseller={Boolean(
                          product.bestseller
                        )}
                      />
                    </motion.div>
                  )
                )}
              </div>
            ) : (
              <div className="mt-12 rounded-[32px] border border-dashed border-[#D8C3B2] bg-background px-6 py-20 text-center">
                <h2 className="font-heading text-4xl font-semibold text-primary">
                  No Products Found
                </h2>

                <p className="mx-auto mt-4 max-w-lg font-body leading-7 text-[#75695F]">
                  Try changing your search, category,
                  collection, availability or price range.
                </p>

                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-7 rounded-full bg-primary px-8 py-4 font-body text-sm font-medium text-white transition hover:-translate-y-1 hover:bg-[#4E3829]"
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