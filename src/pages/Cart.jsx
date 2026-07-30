import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";

export default function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);

  function getPriceNumber(price) {
    const parsedPrice = Number(
      String(price ?? 0).replace(/[₹,\s]/g, "")
    );

    return Number.isFinite(parsedPrice) ? parsedPrice : 0;
  }

  const subtotal = cartItems.reduce(
    (total, item) =>
      total +
      getPriceNumber(item.price) *
        Math.max(1, Number(item.quantity) || 1),
    0
  );

  const shipping =
    subtotal >= 1999 || subtotal === 0 ? 0 : 99;

  const discountAmount = Number(
    appliedCoupon?.discount_amount || 0
  );

  const finalTotal = Math.max(
    subtotal + shipping - discountAmount,
    0
  );

  const totalQuantity = cartItems.reduce(
    (total, item) =>
      total + Math.max(1, Number(item.quantity) || 1),
    0
  );

  const freeShippingRemaining = Math.max(
    0,
    1999 - subtotal
  );

  const shippingProgress = Math.min(
    (subtotal / 1999) * 100,
    100
  );

  const estimatedDelivery = new Date();

  estimatedDelivery.setDate(
    estimatedDelivery.getDate() + 5
  );

  const deliveryDate =
    estimatedDelivery.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  useEffect(() => {
    if (!appliedCoupon) return;

    async function revalidateAppliedCoupon() {
      try {
        const { data, error } = await supabase.rpc(
          "validate_coupon",
          {
            p_code: appliedCoupon.code,
            p_cart_subtotal: subtotal,
          }
        );

        if (error || !data?.valid) {
          setAppliedCoupon(null);
          setCouponMessage(
            data?.message ||
              "Cart updated. Please apply the coupon again."
          );
          return;
        }

        setAppliedCoupon(data);
        setCouponMessage(
          data.message || "Coupon applied successfully."
        );
      } catch (error) {
        console.error(
          "Coupon revalidation error:",
          error
        );

        setAppliedCoupon(null);
        setCouponMessage(
          "Cart updated. Please apply the coupon again."
        );
      }
    }

    revalidateAppliedCoupon();
  }, [subtotal]);

  async function handleApplyCoupon() {
    const code = couponCode.trim().toUpperCase();

    if (!code) {
      setAppliedCoupon(null);
      setCouponMessage(
        "Please enter a coupon code."
      );
      return;
    }

    if (subtotal <= 0) {
      setAppliedCoupon(null);
      setCouponMessage("Your cart is empty.");
      return;
    }

    try {
      setIsCheckingCoupon(true);
      setCouponMessage("");

      const { data, error: couponError } =
        await supabase.rpc("validate_coupon", {
          p_code: code,
          p_cart_subtotal: subtotal,
        });

      if (couponError) {
        throw couponError;
      }

      if (!data?.valid) {
        setAppliedCoupon(null);
        setCouponMessage(
          data?.message || "Invalid coupon code."
        );
        return;
      }

      setCouponCode(data.code || code);
      setAppliedCoupon(data);
      setCouponMessage(
        data.message || "Coupon applied successfully."
      );
    } catch (couponError) {
      console.error(
        "Coupon validation error:",
        couponError
      );

      setAppliedCoupon(null);
      setCouponMessage(
        couponError?.message ||
          "Unable to validate coupon."
      );
    } finally {
      setIsCheckingCoupon(false);
    }
  }

  function handleRemoveCoupon() {
    setCouponCode("");
    setAppliedCoupon(null);
    setCouponMessage("");
  }

  function handleCouponInputChange(event) {
    setCouponCode(
      event.target.value.toUpperCase()
    );

    if (appliedCoupon) {
      setAppliedCoupon(null);
      setCouponMessage("");
    }
  }

  function handleClearCart() {
    const confirmed = window.confirm(
      "Clear complete cart?"
    );

    if (!confirmed) return;

    handleRemoveCoupon();
    clearCart();
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background pt-28">
        <section className="border-b border-primary/10 px-6 py-14 text-center">
          <p className="font-body text-xs uppercase tracking-[0.4em] text-secondary">
            Your Selection
          </p>

          <h1 className="mt-5 font-heading text-5xl font-semibold text-primary sm:text-6xl">
            Shopping Cart
          </h1>

          <p className="mt-4 font-body text-[#75695F]">
            {totalQuantity}{" "}
            {totalQuantity === 1 ? "item" : "items"} in
            your cart
          </p>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            {cartItems.length === 0 ? (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="rounded-[40px] bg-white px-6 py-24 text-center shadow-lg"
              >
                <div className="text-6xl">🛍️</div>

                <h2 className="mt-7 font-heading text-4xl font-semibold text-primary sm:text-5xl">
                  Your Cart is Empty
                </h2>

                <p className="mx-auto mt-5 max-w-lg font-body leading-8 text-[#75695F]">
                  Discover beautiful handmade creations
                  and add something special to your cart.
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
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-body text-sm text-primary">
                        {freeShippingRemaining > 0
                          ? `Add ₹${freeShippingRemaining.toLocaleString(
                              "en-IN"
                            )} more for free shipping`
                          : "You unlocked free shipping!"}
                      </p>

                      <span className="text-lg">
                        {freeShippingRemaining > 0
                          ? "🚚"
                          : "✓"}
                      </span>
                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-cream">
                      <div
                        className="h-full rounded-full bg-secondary transition-all duration-500"
                        style={{
                          width: `${shippingProgress}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    {cartItems.map(
                      (item, index) => {
                        const quantity = Math.max(
                          1,
                          Number(item.quantity) || 1
                        );

                        return (
                          <motion.div
                            key={item.id}
                            initial={{
                              opacity: 0,
                              y: 25,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            transition={{
                              delay: index * 0.08,
                            }}
                            className="rounded-[32px] bg-white p-5 shadow-md md:p-7"
                          >
                            <div className="flex flex-col gap-6 sm:flex-row">
                              <Link
                                to={`/product/${item.id}`}
                                className="shrink-0 overflow-hidden rounded-[24px]"
                              >
                                <img
                                  src={item.image}
                                  alt={
                                    item.name ||
                                    "Tashekari Product"
                                  }
                                  className="h-56 w-full object-cover transition duration-500 hover:scale-105 sm:h-44 sm:w-44"
                                />
                              </Link>

                              <div className="flex flex-1 flex-col justify-between">
                                <div>
                                  <p className="font-body text-xs uppercase tracking-[0.3em] text-secondary">
                                    Handmade Collection
                                  </p>

                                  <Link
                                    to={`/product/${item.id}`}
                                  >
                                    <h2 className="mt-3 font-heading text-3xl font-semibold text-primary transition hover:text-secondary">
                                      {item.name}
                                    </h2>
                                  </Link>

                                  <p className="mt-3 font-body text-lg font-semibold text-secondary">
                                    ₹
                                    {getPriceNumber(
                                      item.price
                                    ).toLocaleString(
                                      "en-IN"
                                    )}
                                  </p>
                                </div>

                                <div className="mt-6 flex flex-wrap items-center justify-between gap-5">
                                  <div className="flex items-center rounded-full border border-primary/15 bg-background p-1">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        decreaseQuantity(
                                          item.id
                                        )
                                      }
                                      className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-primary transition hover:bg-white"
                                    >
                                      −
                                    </button>

                                    <span className="w-12 text-center font-body font-semibold text-primary">
                                      {quantity}
                                    </span>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        increaseQuantity(
                                          item.id
                                        )
                                      }
                                      className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xl text-white transition hover:bg-[#4E3829]"
                                    >
                                      +
                                    </button>
                                  </div>

                                  <div className="flex items-center gap-6">
                                    <p className="font-heading text-2xl font-semibold text-primary">
                                      ₹
                                      {(
                                        getPriceNumber(
                                          item.price
                                        ) * quantity
                                      ).toLocaleString(
                                        "en-IN"
                                      )}
                                    </p>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        const confirmed =
                                          window.confirm(
                                            `Remove "${
                                              item.name ||
                                              "this product"
                                            }" from cart?`
                                          );

                                        if (
                                          confirmed
                                        ) {
                                          removeFromCart(
                                            item.id
                                          );
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
                        );
                      }
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleClearCart}
                    className="ml-6 mt-6 rounded-full border border-red-500 px-5 py-2 text-sm font-medium text-red-500 transition hover:bg-red-500 hover:text-white"
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

                      <span>
                        ₹
                        {subtotal.toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-[#75695F]">
                      <span>Shipping</span>

                      <span>
                        {shipping === 0
                          ? "Free"
                          : `₹${shipping.toLocaleString(
                              "en-IN"
                            )}`}
                      </span>
                    </div>

                    {appliedCoupon && (
                      <div className="flex justify-between gap-4 text-green-600">
                        <span>
                          Coupon (
                          {appliedCoupon.code})
                        </span>

                        <span>
                          -₹
                          {discountAmount.toLocaleString(
                            "en-IN"
                          )}
                        </span>
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
                        value={couponCode}
                        onChange={
                          handleCouponInputChange
                        }
                        placeholder="Enter coupon"
                        disabled={isCheckingCoupon}
                        className="min-w-0 flex-1 rounded-full border border-primary/15 bg-background px-5 py-3 font-body text-sm uppercase text-primary outline-none focus:border-secondary disabled:opacity-60"
                      />

                      {appliedCoupon ? (
                        <button
                          type="button"
                          onClick={
                            handleRemoveCoupon
                          }
                          className="rounded-full border border-red-500 px-5 py-3 font-body text-sm font-medium text-red-500 transition hover:bg-red-500 hover:text-white"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={
                            handleApplyCoupon
                          }
                          disabled={
                            isCheckingCoupon
                          }
                          className="rounded-full bg-primary px-5 py-3 font-body text-sm font-medium text-white transition hover:bg-[#4E3829] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isCheckingCoupon
                            ? "Checking..."
                            : "Apply"}
                        </button>
                      )}
                    </div>

                    {couponMessage && (
                      <p
                        className={`mt-3 font-body text-xs ${
                          appliedCoupon
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {couponMessage}
                      </p>
                    )}

                    <p className="mt-2 font-body text-xs text-[#9A8D83]">
                      Try code: WELCOME10
                    </p>
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-primary/10 pt-7">
                    <span className="font-heading text-3xl font-semibold text-primary">
                      Total
                    </span>

                    <span className="font-heading text-3xl font-semibold text-primary">
                      ₹
                      {finalTotal.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <Link
  to="/checkout"
  state={{
    couponCode: appliedCoupon?.code || "",
  }}
                    className="mt-8 block w-full rounded-full bg-primary py-5 text-center font-body font-medium text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#4E3829]"
                  >
                    Proceed to Secure Checkout →
                  </Link>

                  <div className="mt-7 rounded-2xl bg-[#F8F5F1] p-5">
                    <h3 className="font-semibold text-primary">
                      Delivery Information
                    </h3>

                    <div className="mt-4 space-y-3 text-sm text-[#75695F]">
                      <p>🚚 Estimated Delivery</p>

                      <p className="font-medium text-primary">
                        {deliveryDate}
                      </p>

                      <p>
                        🔒 100% Secure Checkout
                      </p>

                      <p>
                        🎁 Handmade & Carefully
                        Packed
                      </p>

                      <p>
                        🌿 Sustainable Packaging
                      </p>

                      <p>
                        💬 Support via WhatsApp
                      </p>
                    </div>
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