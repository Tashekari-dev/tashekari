import { useParams } from "react-router-dom";
import { products } from "../data/products";

export default function Product() {
  const { id } = useParams();

  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    return (
      <div className="pt-40 text-center">
        <h1 className="text-5xl font-bold text-red-500">
          Product Not Found
        </h1>
      </div>
    );
  }

  return (
    <section className="pt-36 pb-20 bg-[#F8F5F1] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">

        <img
          src={product.image}
          alt={product.name}
          className="rounded-3xl shadow-xl w-full"
        />

        <div>

          <p className="uppercase tracking-[0.3em] text-[#A67C52]">
            Tashekari Collection
          </p>

          <h1 className="text-5xl font-bold text-[#6B4F3A] mt-3">
            {product.name}
          </h1>

          <p className="text-3xl mt-6 text-[#A67C52] font-semibold">
            {product.price}
          </p>

          <p className="mt-8 text-gray-600 leading-8">
            Handmade with premium cotton cords.
            Every product is carefully crafted by artisans
            using sustainable materials.

            Perfect for gifting, home décor and everyday use.
          </p>

          <button className="mt-10 bg-[#6B4F3A] text-white px-8 py-4 rounded-full hover:bg-[#4E3829] duration-300">
            Add To Cart
          </button>

        </div>

      </div>
    </section>
  );
}