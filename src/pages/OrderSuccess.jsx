import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
export default function OrderSuccess() {
  return (
    <>
      <Navbar />

      <section className="pt-40 pb-24 bg-[#F8F5F1] min-h-screen text-center">
        <h1 className="text-6xl font-bold text-[#6B4F3A]">
          Order Placed Successfully!
        </h1>

        <p className="mt-6 text-gray-600">
          Thank you for shopping with Tashekari.
        </p>

        <Link to="/shop">
          <button className="mt-10 bg-[#6B4F3A] text-white px-8 py-4 rounded-full">
            Continue Shopping
          </button>
        </Link>
      </section>

      <Footer />
    </>
  );
}