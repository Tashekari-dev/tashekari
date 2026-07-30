import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
}
export default function Checkout() {
const [couponCode, setCouponCode] = useState("");
const [appliedCoupon, setAppliedCoupon] = useState(null);
const [couponMessage, setCouponMessage] = useState("");
const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
const { cartItems, clearCart } = useCart();
const { user, authLoading } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [error, setError] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

 const [formData, setFormData] = useState({
  fullName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  orderNotes: "",
});
useEffect(() => {
  if (authLoading || !user) {
    return;
  }

  const savedFullName =
    user.user_metadata?.full_name?.trim() ||
    user.user_metadata?.name?.trim() ||
    user.email?.split("@")[0] ||
    "";

  setFormData((current) => ({
    ...current,
    fullName: current.fullName || savedFullName,
    email: user.email || current.email,
  }));
}, [authLoading, user]);

  function getPriceNumber(price) {
    return Number(String(price).replace(/[₹,\s]/g, ""));
  }

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + getPriceNumber(item.price) * item.quantity,
    0
  );
  useEffect(() => {
  const transferredCoupon =
    location.state?.couponCode?.trim();

  if (!transferredCoupon || subtotal <= 0) {
    return;
  }

  setCouponCode(transferredCoupon);

  async function applyTransferredCoupon() {
    try {
      setIsCheckingCoupon(true);

      const { data, error } = await supabase.rpc(
        "validate_coupon",
        {
          p_code: transferredCoupon,
          p_cart_subtotal: subtotal,
        }
      );

      if (error) throw error;

      if (!data?.valid) {
        setAppliedCoupon(null);
        setCouponMessage(
          data?.message || "Coupon is no longer valid."
        );
        return;
      }

      setAppliedCoupon(data);
      setCouponMessage(
        data.message || "Coupon applied successfully."
      );
    } catch (error) {
      console.error("Transferred coupon error:", error);
      setAppliedCoupon(null);
      setCouponMessage("Unable to apply transferred coupon.");
    } finally {
      setIsCheckingCoupon(false);
    }
  }

  applyTransferredCoupon();
}, [location.state, subtotal]);

  const shipping = subtotal >= 1999 || subtotal === 0 ? 0 : 99;
 const discount = Number(appliedCoupon?.discount_amount || 0);

const finalTotal = Math.max(
  subtotal + shipping - discount,
  0
);
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }
 async function handleApplyCoupon() {
  const code = couponCode.trim().toUpperCase();

  if (!code) {
    setAppliedCoupon(null);
    setCouponMessage("Please enter a coupon code.");
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

    const { data, error: couponError } = await supabase.rpc(
      "validate_coupon",
      {
        p_code: code,
        p_cart_subtotal: subtotal,
      }
    );

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
    console.error("Coupon validation error:", couponError);

    setAppliedCoupon(null);
    setCouponMessage(
      couponError?.message || "Unable to validate coupon."
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

 async function handleSubmit(event) {
  event.preventDefault();
  console.log("Cart Items:", cartItems);
  setError("");

  if (cartItems.length === 0) {
    setError("Your cart is empty. Please add a product first.");
    return;
  }

  if (
    !formData.fullName.trim() ||
    !formData.phone.trim() ||
    !formData.email.trim() ||
    !formData.address.trim() ||
    !formData.city.trim() ||
    !formData.state.trim() ||
    !formData.pincode.trim()
  ) {
    setError("Please fill all shipping details.");
    return;
  }

  if (!/^[6-9]\d{9}$/.test(formData.phone)) {
    setError("Please enter a valid 10-digit phone number.");
    return;
  }

  if (!/\S+@\S+\.\S+/.test(formData.email)) {
    setError("Please enter a valid email address.");
    return;
  }

  if (!/^\d{6}$/.test(formData.pincode)) {
    setError("Please enter a valid 6-digit pincode.");
    return;
  }

  // Cash on Delivery
if (paymentMethod === "cod") {
  try {
    setIsPlacingOrder(true);

    const { data, error: codError } =
      await supabase.functions.invoke("place-cod-order", {
        body: {
          orderData: {
            fullName: formData.fullName,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            items: cartItems,
            amount: finalTotal,
            subtotal,
shipping,
couponCode: appliedCoupon?.code || null,
couponId: appliedCoupon?.coupon_id || null,
discountAmount: discount,
          },
        },
      });

    if (codError) {
      throw new Error(
        codError.message || "Unable to place COD order."
      );
    }

    if (!data?.success) {
      throw new Error(
        data?.message || "Unable to place COD order."
      );
    }

    clearCart();

    navigate("/order-success", {
      state: {
        paymentMethod: "cod",
        orderId: data.orderId,
        amount: finalTotal,
      },
    });

    return;
  } catch (codOrderError) {
    console.error("COD order error:", codOrderError);

    setError(
      codOrderError instanceof Error
        ? codOrderError.message
        : "Unable to place COD order."
    );

    return;
  } finally {
    setIsPlacingOrder(false);
  }
}

  // Online Payment
  try {
    setIsPlacingOrder(true);

    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      throw new Error(
        "Razorpay checkout could not load. Please check your internet connection."
      );
    }

    const { data, error: functionError } =
      await supabase.functions.invoke("create-razorpay-order", {
        body: {
          amount: finalTotal,
          receipt: `tashekari_${Date.now()}`,
        },
      });

    if (functionError) {
      throw new Error(
        functionError.message || "Unable to create payment order."
      );
    }

    if (!data?.id || !data?.keyId) {
      throw new Error("Invalid order response received.");
    }

    const options = {
      key: data.keyId,
      amount: data.amount,
      currency: data.currency || "INR",
      name: "Tashekari",
      description: "Handmade Macrame Order",
      order_id: data.id,

      prefill: {
        name: formData.fullName,
        email: formData.email,
        contact: formData.phone,
      },

      notes: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        orderNotes: formData.orderNotes || "",
      },

      theme: {
        color: "#6B4F3A",
      },
handler: async function (response) {
  try {
    const { data: verificationData, error: verificationError } =
      await supabase.functions.invoke("verify-razorpay-payment", {
       body: {
  razorpay_order_id: response.razorpay_order_id,
  razorpay_payment_id: response.razorpay_payment_id,
  razorpay_signature: response.razorpay_signature,
  original_order_id: data.id,

  orderData: {
    fullName: formData.fullName,
    phone: formData.phone,
    email: formData.email,
    address: formData.address,
    city: formData.city,
    state: formData.state,
    pincode: formData.pincode,
    items: cartItems,
    amount: finalTotal,
    subtotal,
shipping,
couponCode: appliedCoupon?.code || null,
couponId: appliedCoupon?.coupon_id || null,
discountAmount: discount,
  },
},
      });

    if (verificationError) {
      throw new Error(
        verificationError.message ||
          "Payment verification request failed."
      );
    }

    if (!verificationData?.success) {
      throw new Error(
        verificationData?.message ||
          "Payment verification failed."
      );
    }

    clearCart();

    navigate("/order-success", {
      state: {
        paymentMethod: "online",
        paymentId: verificationData.paymentId,
        orderId: verificationData.orderId,
        amount: finalTotal,
      },
    });
  } catch (verificationError) {
    console.error(
      "Payment verification error:",
      verificationError
    );

    setError(
      verificationError instanceof Error
        ? verificationError.message
        : "Payment verification failed."
    );
  } finally {
    setIsPlacingOrder(false);
  }
},

      modal: {
        ondismiss: function () {
          setIsPlacingOrder(false);
        },
      },
    };

    const razorpayCheckout = new window.Razorpay(options);

    razorpayCheckout.on("payment.failed", function (response) {
      const message =
        response?.error?.description ||
        "Payment failed. Please try again.";

      setError(message);
      setIsPlacingOrder(false);
    });

    razorpayCheckout.open();
  } catch (paymentError) {
    console.error("Online payment error:", paymentError);

    setError(
      paymentError instanceof Error
        ? paymentError.message
        : "Unable to start online payment."
    );

    setIsPlacingOrder(false);
  }
}
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background pt-28">
        <section className="border-b border-primary/10 px-6 py-14 text-center">
          <p className="font-body text-xs uppercase tracking-[0.4em] text-secondary">
            Secure Checkout
          </p>

          <h1 className="mt-5 font-heading text-6xl font-semibold text-primary">
            Complete Your Order
          </h1>

          <p className="mx-auto mt-4 max-w-2xl font-body leading-8 text-[#75695F]">
            Enter your delivery details and review your handmade Tashekari
            collection before placing the order.
          </p>
        </section>

        <section className="py-16">
          <form
            onSubmit={handleSubmit}
            className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_420px] lg:px-10"
          >
            <motion.div
              initial={{ opacity: 0, x: -35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="rounded-[36px] bg-white p-7 shadow-lg sm:p-10">
                <p className="font-body text-xs uppercase tracking-[0.35em] text-secondary">
                  Step 01
                </p>

                <h2 className="mt-4 font-heading text-4xl font-semibold text-primary">
                  Contact Information
                </h2>

                <div className="mt-8 grid gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block font-body text-sm font-medium text-primary">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full rounded-2xl border border-primary/15 bg-background px-5 py-4 font-body text-primary outline-none transition focus:border-secondary"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-body text-sm font-medium text-primary">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit phone number"
                      maxLength="10"
                      className="w-full rounded-2xl border border-primary/15 bg-background px-5 py-4 font-body text-primary outline-none transition focus:border-secondary"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-body text-sm font-medium text-primary">
                      Email Address
                    </label>

                   <input
  type="email"
  name="email"
  value={formData.email}
  onChange={handleChange}
  placeholder="you@example.com"
  readOnly={Boolean(user)}
  className={`w-full rounded-2xl border border-primary/15 px-5 py-4 font-body text-primary outline-none transition focus:border-secondary ${
    user
      ? "cursor-not-allowed bg-gray-100"
      : "bg-background"
  }`}
/>
{user && (
  <p className="mt-2 font-body text-xs text-[#817267]">
    This order will be linked to your logged-in account.
  </p>
)}
                  </div>
                </div>
              </div>

              <div className="rounded-[36px] bg-white p-7 shadow-lg sm:p-10">
                <p className="font-body text-xs uppercase tracking-[0.35em] text-secondary">
                  Step 02
                </p>

                <h2 className="mt-4 font-heading text-4xl font-semibold text-primary">
                  Shipping Address
                </h2>

                <div className="mt-8 grid gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block font-body text-sm font-medium text-primary">
                      Full Address
                    </label>

                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="4"
                      placeholder="House number, street and locality"
                      className="w-full resize-none rounded-2xl border border-primary/15 bg-background px-5 py-4 font-body text-primary outline-none transition focus:border-secondary"
                    />
                  </div>

                  <div className="mt-8 grid min-w-0 gap-5 md:grid-cols-2">
                    <label className="mb-2 block font-body text-sm font-medium text-primary">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full rounded-2xl border border-primary/15 bg-background px-5 py-4 font-body text-primary outline-none transition focus:border-secondary"
                    />
                  </div>

               <div className="mt-8 grid min-w-0 gap-5 md:grid-cols-2">
  <label className="mb-2 block font-body text-sm font-medium text-primary">
    State
  </label>

 <select
  name="state"
  value={formData.state}
  onChange={handleChange}
  size="1"
  className="block h-14 w-full min-w-0 max-w-full rounded-2xl border border-primary/15 bg-background px-4 font-body text-sm text-primary outline-none transition focus:border-secondary sm:px-5 sm:text-base"
>
    <option value="">Select State</option>
    <option value="Andhra Pradesh">Andhra Pradesh</option>
    <option value="Assam">Assam</option>
    <option value="Bihar">Bihar</option>
    <option value="Chhattisgarh">Chhattisgarh</option>
    <option value="Delhi">Delhi</option>
    <option value="Goa">Goa</option>
    <option value="Gujarat">Gujarat</option>
    <option value="Haryana">Haryana</option>
    <option value="Himachal Pradesh">Himachal Pradesh</option>
    <option value="Jharkhand">Jharkhand</option>
    <option value="Karnataka">Karnataka</option>
    <option value="Kerala">Kerala</option>
    <option value="Madhya Pradesh">Madhya Pradesh</option>
    <option value="Maharashtra">Maharashtra</option>
    <option value="Odisha">Odisha</option>
    <option value="Punjab">Punjab</option>
    <option value="Rajasthan">Rajasthan</option>
    <option value="Tamil Nadu">Tamil Nadu</option>
    <option value="Telangana">Telangana</option>
    <option value="Uttar Pradesh">Uttar Pradesh</option>
    <option value="Uttarakhand">Uttarakhand</option>
    <option value="West Bengal">West Bengal</option>
  </select>
</div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block font-body text-sm font-medium text-primary">
                      Pincode
                    </label>
                    
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="6-digit pincode"
                      maxLength="6"
                      className="w-full rounded-2xl border border-primary/15 bg-background px-5 py-4 font-body text-primary outline-none transition focus:border-secondary"
                    />
                    <div className="md:col-span-2">
  <label className="mb-2 block font-body text-sm font-medium text-primary">
    Order Notes
  </label>

  <textarea
    name="orderNotes"
    value={formData.orderNotes}
    onChange={handleChange}
    rows="4"
    placeholder="Gift packing, custom message or delivery instructions"
    className="w-full resize-none rounded-2xl border border-primary/15 bg-background px-5 py-4 font-body text-primary outline-none transition focus:border-secondary"
  />
</div>
                  </div>
                </div>
              </div>

              <div className="rounded-[36px] bg-white p-7 shadow-lg sm:p-10">
                <p className="font-body text-xs uppercase tracking-[0.35em] text-secondary">
                  Step 03
                </p>

                <h2 className="mt-4 font-heading text-4xl font-semibold text-primary">
                  Payment Method
                </h2>

                <div className="mt-8 grid gap-4">
                  <label
                    className={`cursor-pointer rounded-2xl border p-5 transition ${
                      paymentMethod === "cod"
                        ? "border-primary bg-background"
                        : "border-primary/10"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={(event) =>
                          setPaymentMethod(event.target.value)
                        }
                        className="mt-1"
                      />

                      <div>
                        <h3 className="font-body font-semibold text-primary">
                          Cash on Delivery
                        </h3>

                        <p className="mt-1 font-body text-sm text-[#75695F]">
                          Pay when your Tashekari order arrives.
                        </p>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`cursor-pointer rounded-2xl border p-5 transition ${
                      paymentMethod === "online"
                        ? "border-primary bg-background"
                        : "border-primary/10"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="radio"
                        name="payment"
                        value="online"
                        checked={paymentMethod === "online"}
                        onChange={(event) =>
                          setPaymentMethod(event.target.value)
                        }
                        className="mt-1"
                      />

                      <div>
                        <h3 className="font-body font-semibold text-primary">
                          Online Payment
                        </h3>

                        <p className="mt-1 font-body text-sm text-[#75695F]">
                          UPI, cards and net banking through Razorpay.
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, x: 35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="h-fit rounded-[36px] bg-white p-7 shadow-xl lg:sticky lg:top-28"
            >
              <h2 className="font-heading text-4xl font-semibold text-primary">
                Order Summary
              </h2>
            <div className="rounded-2xl bg-background p-4">
  <p className="font-body text-sm font-medium text-primary">
    Coupon Code
  </p>

  <div className="mt-3 flex gap-3">
    <input
      type="text"
      value={couponCode}
      onChange={(event) => {
        setCouponCode(event.target.value.toUpperCase());

        if (appliedCoupon) {
          setAppliedCoupon(null);
          setCouponMessage("");
        }
      }}
      placeholder="Enter coupon"
      disabled={isCheckingCoupon}
      className="min-w-0 flex-1 rounded-full border border-primary/15 bg-white px-4 py-3 font-body text-sm uppercase text-primary outline-none focus:border-secondary disabled:opacity-60"
    />

    {appliedCoupon ? (
      <button
        type="button"
        onClick={handleRemoveCoupon}
        className="rounded-full border border-red-500 px-5 py-3 font-body text-sm font-medium text-red-500 transition hover:bg-red-500 hover:text-white"
      >
        Remove
      </button>
    ) : (
      <button
        type="button"
        onClick={handleApplyCoupon}
        disabled={isCheckingCoupon}
        className="rounded-full bg-primary px-5 py-3 font-body text-sm font-medium text-white transition hover:bg-[#4E3829] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isCheckingCoupon ? "Checking..." : "Apply"}
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

  <p className="mt-2 font-body text-xs text-[#817267]">
    Try code: WELCOME10
  </p>
</div>
              {cartItems.length === 0 ? (
                <div className="mt-8 rounded-2xl bg-background p-6 text-center">
                  <p className="font-body text-[#75695F]">
                    Your cart is currently empty.
                  </p>

                  <Link
                    to="/shop"
                    className="mt-5 inline-block font-body text-sm font-semibold text-secondary"
                  >
                    Go To Shop →
                  </Link>
                </div>
              ) : (
                <div className="mt-8 max-h-[360px] space-y-5 overflow-y-auto pr-2">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 border-b border-primary/10 pb-5"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-20 rounded-2xl object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <h3 className="font-heading text-xl font-semibold text-primary">
                          {item.name}
                        </h3>

                        <p className="mt-1 font-body text-xs text-[#817267]">
                          Quantity: {item.quantity}
                        </p>

                        <p className="mt-2 font-body font-semibold text-secondary">
                          ₹
                          {(
                            getPriceNumber(item.price) * item.quantity
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 space-y-4 border-b border-primary/10 pb-7 font-body">
  <div className="flex justify-between text-[#75695F]">
    <span>Subtotal</span>
    <span>₹{subtotal.toLocaleString()}</span>
  </div>

  <div className="flex justify-between text-[#75695F]">
    <span>Shipping</span>
    <span>
      {shipping === 0 ? "Free" : `₹${shipping.toLocaleString()}`}
    </span>
  </div>

 {appliedCoupon && (
    <div className="flex justify-between text-green-600">
      <span>Coupon ({appliedCoupon.code})</span>
      <span>-₹{discount.toLocaleString()}</span>
    </div>
  )}
</div>
              <div className="mt-7 flex items-center justify-between">
                <span className="font-heading text-3xl font-semibold text-primary">
                  Total
                </span>

                <span className="font-heading text-3xl font-semibold text-primary">
                  ₹{finalTotal.toLocaleString()}
                </span>
              </div>

              {error && (
                <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 font-body text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={cartItems.length === 0 || isPlacingOrder}
                className="mt-8 w-full rounded-full bg-primary py-5 font-body font-medium text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#4E3829] disabled:cursor-not-allowed disabled:opacity-50"
              >
               {isPlacingOrder
  ? "Please Wait..."
  : paymentMethod === "cod"
    ? "Place COD Order"
    : "Proceed To Payment"}
              </button>

              <Link
                to="/cart"
                className="mt-4 block text-center font-body text-sm font-medium text-secondary transition hover:text-primary"
              >
                ← Back To Cart
              </Link>

              <div className="mt-7 space-y-3 font-body text-xs text-[#817267]">
                <p>✓ Secure checkout</p>
                <p>✓ Carefully packed handmade products</p>
                <p>✓ Free shipping above ₹1,999</p>
              </div>
            </motion.aside>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
}