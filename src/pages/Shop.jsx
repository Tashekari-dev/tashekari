import { useState } from "react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/common/ProductCard";

import { products } from "../data/products";
export default function Shop() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", "Bags", "Keychains", "Accessories", "Bookmarks"];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar />

      <section className="pt-36 pb-16 bg-[#F8F5F1] text-center">
        <h1 className="text-6xl font-bold text-[#6B4F3A]">Shop</h1>
        <p className="mt-4 text-gray-600">
          Explore all handmade Tashekari products.
        </p>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-5 justify-between mb-12">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-[350px] border border-[#E7D8CA] rounded-full px-6 py-4 outline-none"
            />

            <div className="flex flex-wrap gap-3">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`px-6 py-3 rounded-full border ${
                    category === item
                      ? "bg-[#6B4F3A] text-white"
                      : "border-[#E7D8CA] text-[#6B4F3A]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {filteredProducts.map((product) => (
  <ProductCard
    key={product.id}
    id={product.id}
    image={product.image}
    name={product.name}
    price={product.price}
  />
))}
            
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}