import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { cartItems, clearCart } = useCart();

  const total = cartItems.reduce((sum, item) => {
    const price = Number(item.price.replace(/[₹,]/g, ""));
    return sum + price * item.quantity;
  }, 0);

  return (
    <>
      <Navbar />

      <section className="pt-36 pb-20 bg-[#F8F5F1] min-h-screen">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-3xl p-8 shadow">
            <h1 className="text-4xl font-bold text-[#6B4F3A] mb-8">
              Shipping Details
            </h1>

            <div className="grid gap-5">
              <input className="border rounded-full px-6 py-4" placeholder="Full Name" />
              <input className="border rounded-full px-6 py-4" placeholder="Phone Number" />
              <input className="border rounded-full px-6 py-4" placeholder="Email Address" />
              <textarea className="border rounded-3xl px-6 py-4" rows="4" placeholder="Full Address"></textarea>
              <input className="border rounded-full px-6 py-4" placeholder="City" />
              <input className="border rounded-full px-6 py-4" placeholder="Pincode" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow h-fit">
            <h2 className="text-4xl font-bold text-[#6B4F3A] mb-8">
              Order Summary
            </h2>

            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between border-b pb-4 mb-4">
                <div>
                  <h3 className="font-semibold text-[#6B4F3A]">{item.name}</h3>
                  <p className="text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-[#A67C52]">{item.price}</p>
              </div>
            ))}

            <div className="flex justify-between text-2xl font-bold text-[#6B4F3A] mt-8">
              <span>Total</span>
              <span>₹ {total.toLocaleString()}</span>
            </div>

            <Link to="/order-success">
              <button
                onClick={clearCart}
                className="mt-8 w-full bg-[#6B4F3A] text-white py-4 rounded-full hover:bg-[#4E3829] duration-300"
              >
                Place Order
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}