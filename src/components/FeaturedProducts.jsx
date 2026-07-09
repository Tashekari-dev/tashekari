import { products } from "../data/products";
import ProductCard from "./common/ProductCard";

export default function FeaturedProducts() {
  const featuredProducts = products.filter((product) => product.featured);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl font-bold text-center text-[#6B4F3A]">
          Best Sellers
        </h2>

        <p className="text-center text-gray-500 mt-4">
          Handmade pieces our customers love the most.
        </p>

        <div className="grid md:grid-cols-3 gap-10 mt-16">
          {featuredProducts.map((product) => (
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
  );
}