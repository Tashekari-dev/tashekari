import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const total = cartItems.reduce((sum, item) => {
    const price = Number(item.price.replace(/[₹,]/g, ""));
    return sum + price * item.quantity;
  }, 0);

  return (
    <>
      <Navbar />

      <section className="pt-36 pb-20 bg-[#F8F5F1] min-h-screen">
        <div className="max-w-6xl mx-auto px-6">

          <h1 className="text-5xl font-bold text-[#6B4F3A] mb-10">
            Your Cart
          </h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-3xl font-semibold text-[#6B4F3A]">
                Your Cart is Empty
              </h2>

              <p className="text-gray-500 mt-4">
                Add some beautiful handmade products.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-6">

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl shadow p-6 flex items-center justify-between flex-wrap gap-6"
                  >

                    <div className="flex items-center gap-6">

                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-28 h-28 object-cover rounded-2xl"
                      />

                      <div>
                        <h2 className="text-2xl font-semibold text-[#6B4F3A]">
                          {item.name}
                        </h2>

                        <p className="text-[#A67C52] mt-2">
                          {item.price}
                        </p>
                      </div>

                    </div>

                    <div className="flex items-center gap-3">

                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="w-10 h-10 rounded-full bg-gray-200"
                      >
                        −
                      </button>

                      <span className="text-xl font-bold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="w-10 h-10 rounded-full bg-[#6B4F3A] text-white"
                      >
                        +
                      </button>

                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 font-semibold hover:underline"
                    >
                      Remove
                    </button>

                  </div>
                ))}

              </div>

              <div className="mt-10 bg-white rounded-3xl shadow p-8">

                <div className="flex justify-between text-3xl font-bold text-[#6B4F3A]">

                  <span>Total</span>

                  <span>₹ {total.toLocaleString()}</span>

                </div>

                <button className="mt-8 w-full bg-[#6B4F3A] text-white py-4 rounded-full text-lg hover:bg-[#4E3829] duration-300">
                  Proceed To Checkout
                </button>

              </div>
            </>
          )}

        </div>
      </section>

      <Footer />
    </>
  );
}