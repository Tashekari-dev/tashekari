import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useCart } from "../context/CartContext";

export default function Cart() {
 const {
  cartItems,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = useCart();

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  function getPriceNumber(price) {
    return Number(String(price).replace(/[₹,\s]/g, ""));
  }

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + getPriceNumber(item.price) * item.quantity,
    0
  );

  const shipping = subtotal >= 1999 || subtotal === 0 ? 0 : 99;
  const discountAmount = Math.round((subtotal * discount) / 100);
  const finalTotal = subtotal + shipping - discountAmount;

  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const freeShippingRemaining = Math.max(0, 1999 - subtotal);
  const shippingProgress = Math.min((subtotal / 1999) * 100, 100);

  function applyCoupon() {
    if (coupon.trim().toUpperCase() === "TASHEKARI10") {
      setDiscount(10);
      setCouponMessage("Coupon applied — 10% discount!");
    } else {
      setDiscount(0);
      setCouponMessage("Invalid coupon code.");
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background pt-28">
        <section className="border-b border-primary/10 px-6 py-14 text-center">
          <p className="font-body text-xs uppercase tracking-[0.4em] text-secondary">
            Your Selection
          </p>

          <h1 className="mt-5 font-heading text-6xl font-semibold text-primary">
            Shopping Cart
          </h1>

          <p className="mt-4 font-body text-[#75695F]">
            {totalQuantity} {totalQuantity === 1 ? "item" : "items"} in your cart
          </p>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            {cartItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[40px] bg-white px-6 py-24 text-center shadow-lg"
              >
                <div className="text-6xl">🛍️</div>

                <h2 className="mt-7 font-heading text-5xl font-semibold text-primary">
                  Your Cart is Empty
                </h2>

                <p className="mx-auto mt-5 max-w-lg font-body leading-8 text-[#75695F]">
                  Discover beautiful handmade creations and add something
                  special to your cart.
                </p>

                <Link
                  to="/shop"
                  className="mt-9 inline-block rounded-full bg-primary px-9 py-4 font-body font-medium text-white transition hover:-translate-y-1 hover:bg-[#4E3829]"
                >
                  Explore Collection
                </Link>
              </motion.div>
            ) : (
              <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
                <div>
                  <div className="mb-8 rounded-[30px] bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="font-body text-sm text-primary">
                        {freeShippingRemaining > 0
                          ? `Add ₹${freeShippingRemaining.toLocaleString()} more for free shipping`
                          : "You unlocked free shipping!"}
                      </p>

                      <span className="text-lg">
                        {freeShippingRemaining > 0 ? "🚚" : "✓"}
                      </span>
                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-cream">
                      <div
                        className="h-full rounded-full bg-secondary transition-all duration-500"
                        style={{ width: `${shippingProgress}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className="rounded-[32px] bg-white p-5 shadow-md md:p-7"
                      >
                        <div className="flex flex-col gap-6 sm:flex-row">
                          <Link
                            to={`/product/${item.id}`}
                            className="shrink-0 overflow-hidden rounded-[24px]"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-56 w-full object-cover transition duration-500 hover:scale-105 sm:h-44 sm:w-44"
                            />
                          </Link>

                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <p className="font-body text-xs uppercase tracking-[0.3em] text-secondary">
                                Handmade Collection
                              </p>

                              <Link to={`/product/${item.id}`}>
                                <h2 className="mt-3 font-heading text-3xl font-semibold text-primary hover:text-secondary">
                                  {item.name}
                                </h2>
                              </Link>

                              <p className="mt-3 font-body text-lg font-semibold text-secondary">
                                {item.price}
                              </p>
                            </div>

                            <div className="mt-6 flex flex-wrap items-center justify-between gap-5">
                              <div className="flex items-center rounded-full border border-primary/15 bg-background p-1">
                                <button
                                  type="button"
                                  onClick={() => decreaseQuantity(item.id)}
                                  className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-primary transition hover:bg-white"
                                >
                                  −
                                </button>

                                <span className="w-12 text-center font-body font-semibold text-primary">
                                  {item.quantity}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => increaseQuantity(item.id)}
                                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xl text-white transition hover:bg-[#4E3829]"
                                >
                                  +
                                </button>
                              </div>

                              <div className="flex items-center gap-6">
                                <p className="font-heading text-2xl font-semibold text-primary">
                                  ₹
                                  {(
                                    getPriceNumber(item.price) * item.quantity
                                  ).toLocaleString()}
                                </p>

                                <button
                                  type="button"
                                  onClick={() => {
  if (
    window.confirm(
      `Remove "${item.name}" from cart?`
    )
  ) {
    removeFromCart(item.id);
  }
}}
                                  className="font-body text-sm text-red-500 transition hover:text-red-700"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <button
  type="button"
  onClick={() => {
    if (window.confirm("Clear complete cart?")) {
      clearCart();
    }
  }}
  className="ml-6 rounded-full border border-red-500 px-5 py-2 text-sm font-medium text-red-500 transition hover:bg-red-500 hover:text-white"
>
  Clear Cart
</button>
                </div>

                <aside className="h-fit rounded-[36px] bg-white p-7 shadow-xl lg:sticky lg:top-28">
                  <h2 className="font-heading text-4xl font-semibold text-primary">
                    Order Summary
                  </h2>

                  <div className="mt-8 space-y-4 border-b border-primary/10 pb-7 font-body">
                    <div className="flex justify-between text-[#75695F]">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-[#75695F]">
                      <span>Shipping</span>
                      <span>
                        {shipping === 0
                          ? "Free"
                          : `₹${shipping.toLocaleString()}`}
                      </span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({discount}%)</span>
                        <span>-₹{discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-7">
                    <p className="font-body text-sm font-medium text-primary">
                      Coupon Code
                    </p>

                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={coupon}
                        onChange={(event) => setCoupon(event.target.value)}
                        placeholder="Enter coupon"
                        className="min-w-0 flex-1 rounded-full border border-primary/15 bg-background px-5 py-3 font-body text-sm text-primary outline-none focus:border-secondary"
                      />

                      <button
                        type="button"
                        onClick={applyCoupon}
                        className="rounded-full bg-cream px-5 py-3 font-body text-sm font-medium text-primary transition hover:bg-secondary hover:text-white"
                      >
                        Apply
                      </button>
                    </div>

                    {couponMessage && (
                      <p
                        className={`mt-3 font-body text-xs ${
                          discount > 0 ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {couponMessage}
                      </p>
                    )}

                    <p className="mt-2 font-body text-xs text-[#9A8D83]">
                      Try code: TASHEKARI10
                    </p>
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-primary/10 pt-7">
                    <span className="font-heading text-3xl font-semibold text-primary">
                      Total
                    </span>

                    <span className="font-heading text-3xl font-semibold text-primary">
                      ₹{finalTotal.toLocaleString()}
                    </span>
                  </div>

                  <Link
                    to="/checkout"
                    className="mt-8 block w-full rounded-full bg-primary py-5 text-center font-body font-medium text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#4E3829]"
                  >
                    Proceed To Checkout
                  </Link>

                  <div className="mt-7 space-y-3 font-body text-xs text-[#817267]">
                    <p>✓ Secure checkout</p>
                    <p>✓ Carefully packed handmade products</p>
                    <p>✓ Free shipping above ₹1,999</p>
                  </div>
                </aside>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}