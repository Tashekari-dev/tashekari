import { useParams, Link } from "react-router-dom";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function Product() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="pt-40 min-h-screen text-center bg-[#F8F5F1]">
          <h1 className="text-5xl font-bold text-red-500">
            Product Not Found
          </h1>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="pt-36 pb-24 bg-[#F8F5F1] min-h-screen">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">
          
          <div className="relative">
            <div className="absolute -top-8 -left-8 w-72 h-72 bg-[#EAD7C4] rounded-full blur-[120px] opacity-70"></div>

            <img
              src={product.image}
              alt={product.name}
              className="relative w-full h-[680px] object-cover rounded-[45px] shadow-2xl"
            />
          </div>

          <div className="bg-white rounded-[40px] p-10 shadow-xl">
            <p className="uppercase tracking-[0.35em] text-[#A67C52] text-sm">
              Tashekari Collection
            </p>

            <h1 className="text-5xl lg:text-6xl font-bold text-[#6B4F3A] mt-5 leading-tight">
              {product.name}
            </h1>

            <p className="text-3xl mt-6 text-[#A67C52] font-semibold">
              {product.price}
            </p>

            <p className="mt-8 text-gray-600 leading-9 text-lg">
              Handmade with premium cotton cords. Every product is carefully
              crafted by artisans using sustainable materials. Perfect for
              gifting, home décor and everyday use.
            </p>

            <div className="grid grid-cols-3 gap-4 mt-8 text-center">
              <div className="bg-[#F8F5F1] rounded-2xl p-4">
                <p className="font-bold text-[#6B4F3A]">Handmade</p>
              </div>
              <div className="bg-[#F8F5F1] rounded-2xl p-4">
                <p className="font-bold text-[#6B4F3A]">Sustainable</p>
              </div>
              <div className="bg-[#F8F5F1] rounded-2xl p-4">
                <p className="font-bold text-[#6B4F3A]">Made with Love</p>
              </div>
            </div>

            <button
              onClick={() => addToCart(product)}
              className="mt-10 w-full bg-[#6B4F3A] text-white py-5 rounded-full text-lg hover:bg-[#4E3829] hover:scale-[1.02] duration-300 shadow-lg"
            >
              Add To Cart
            </button>

            <Link to="/shop">
              <button className="mt-4 w-full border border-[#6B4F3A] text-[#6B4F3A] py-5 rounded-full text-lg hover:bg-[#6B4F3A] hover:text-white duration-300">
                Back To Shop
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}