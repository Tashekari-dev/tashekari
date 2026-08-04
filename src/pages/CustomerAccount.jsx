import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

import {
  getCustomerProfile,
  saveCustomerProfile,
} from "../services/profileService";

const EMPTY_PROFILE = {
  full_name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

export default function CustomerAccount() {
  const { user, authLoading, logout } =
    useAuth();

  const navigate = useNavigate();

  const [activeTab, setActiveTab] =
    useState("dashboard");

  const [orders, setOrders] =
    useState([]);

  const [loadingOrders, setLoadingOrders] =
    useState(true);

  const [ordersError, setOrdersError] =
    useState("");

  const [profile, setProfile] =
    useState(EMPTY_PROFILE);

  const [loadingProfile, setLoadingProfile] =
    useState(true);

  const [savingProfile, setSavingProfile] =
    useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", {
        replace: true,
        state: {
          from: {
            pathname: "/account",
          },
        },
      });
    }
  }, [
    authLoading,
    user,
    navigate,
  ]);

  useEffect(() => {
    async function fetchCustomerProfile() {
      if (!user?.id) {
        return;
      }

      try {
        setLoadingProfile(true);

        const profileData =
          await getCustomerProfile(
            user.id
          );

        const metadataName =
          user.user_metadata
            ?.full_name ||
          user.user_metadata?.name ||
          "";

        setProfile({
          full_name:
            profileData?.full_name ||
            metadataName ||
            "",
          phone:
            profileData?.phone || "",
          address:
            profileData?.address || "",
          city:
            profileData?.city || "",
          state:
            profileData?.state || "",
          pincode:
            profileData?.pincode || "",
        });
      } catch (profileError) {
        console.error(
          "Customer profile load error:",
          profileError
        );

        toast.dismiss();
        toast.error(
          profileError?.message ||
            "Unable to load your profile."
        );
      } finally {
        setLoadingProfile(false);
      }
    }

    fetchCustomerProfile();
  }, [user]);

  useEffect(() => {
    async function fetchCustomerOrders() {
      if (!user?.email) {
        return;
      }

      try {
        setLoadingOrders(true);
        setOrdersError("");

        const {
          data,
          error: ordersFetchError,
        } = await supabase
          .from("orders")
          .select(
            `
              id,
              amount,
              payment_method,
              payment_status,
              status,
              created_at,
              courier_name,
              tracking_number
            `
          )
          .eq("email", user.email)
          .order("created_at", {
            ascending: false,
          });

        if (ordersFetchError) {
          throw ordersFetchError;
        }

        setOrders(data || []);
      } catch (fetchError) {
        console.error(
          "Customer orders error:",
          fetchError
        );

        setOrdersError(
          fetchError?.message ||
            "Unable to load your orders."
        );
      } finally {
        setLoadingOrders(false);
      }
    }

    fetchCustomerOrders();
  }, [user]);

  const fullName =
    profile.full_name ||
    user?.user_metadata
      ?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Tashekari Customer";

  const orderStats = useMemo(() => {
    return {
      total: orders.length,

      active: orders.filter(
        (order) =>
          ![
            "Delivered",
            "Cancelled",
          ].includes(order.status)
      ).length,

      delivered: orders.filter(
        (order) =>
          order.status === "Delivered"
      ).length,

      cancelled: orders.filter(
        (order) =>
          order.status === "Cancelled"
      ).length,
    };
  }, [orders]);

  function handleProfileChange(event) {
    const { name, value } =
      event.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSaveProfile(
    event
  ) {
    event.preventDefault();

    const cleanName =
      profile.full_name.trim();

    const cleanPhone =
      profile.phone.trim();

    const cleanPincode =
      profile.pincode.trim();

    if (!cleanName) {
      toast.dismiss();
      toast.error(
        "Please enter your full name."
      );
      return;
    }

    if (
      cleanPhone &&
      !/^[6-9]\d{9}$/.test(
        cleanPhone
      )
    ) {
      toast.dismiss();
      toast.error(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    if (
      cleanPincode &&
      !/^\d{6}$/.test(
        cleanPincode
      )
    ) {
      toast.dismiss();
      toast.error(
        "Please enter a valid 6-digit pincode."
      );
      return;
    }

    try {
      setSavingProfile(true);
      toast.dismiss();

      const savedProfile =
        await saveCustomerProfile(
          user.id,
          {
            ...profile,
            full_name: cleanName,
            phone: cleanPhone,
            pincode: cleanPincode,
          }
        );

      setProfile({
        full_name:
          savedProfile.full_name || "",
        phone:
          savedProfile.phone || "",
        address:
          savedProfile.address || "",
        city:
          savedProfile.city || "",
        state:
          savedProfile.state || "",
        pincode:
          savedProfile.pincode || "",
      });

      toast.success(
        "Profile saved successfully."
      );
    } catch (saveError) {
      console.error(
        "Customer profile save error:",
        saveError
      );

      toast.dismiss();
      toast.error(
        saveError?.message ||
          "Unable to save your profile."
      );
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleLogout() {
    try {
      await logout();

      navigate("/", {
        replace: true,
      });
    } catch (logoutError) {
      console.error(
        "Customer logout error:",
        logoutError
      );

      toast.dismiss();
      toast.error(
        logoutError?.message ||
          "Unable to logout."
      );
    }
  }

  function getStatusClasses(
    status
  ) {
    if (status === "Delivered") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Shipped") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "Packed") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (status === "Cancelled") {
      return "bg-gray-200 text-gray-700";
    }

    return "bg-red-100 text-red-700";
  }

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="font-body text-primary">
          Loading your account...
        </p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
    },
    {
      id: "profile",
      label: "My Profile",
    },
    {
      id: "address",
      label: "Address Book",
    },
    {
      id: "orders",
      label: "My Orders",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background pb-20 pt-32">
        <section className="border-b border-primary/10 px-6 py-12">
          <div className="mx-auto max-w-7xl">
            <p className="font-body text-xs uppercase tracking-[0.35em] text-secondary">
              My Account
            </p>

            <h1 className="mt-4 font-heading text-5xl font-semibold text-primary">
              Welcome, {fullName}
            </h1>

            <p className="mt-3 font-body text-[#75695F]">
              Manage your profile,
              address and Tashekari
              orders.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[300px_1fr] lg:px-10">
          <aside className="h-fit rounded-[30px] bg-white p-6 shadow-lg lg:sticky lg:top-32">
            <div className="rounded-2xl bg-background p-5">
              <p className="font-body text-xs uppercase tracking-[0.25em] text-secondary">
                Profile
              </p>

              <h2 className="mt-3 font-heading text-3xl font-semibold text-primary">
                {fullName}
              </h2>

              <p className="mt-2 break-all font-body text-sm text-[#75695F]">
                {user.email}
              </p>
            </div>

            <nav className="mt-6 space-y-3">
              {menuItems.map(
                (item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setActiveTab(
                        item.id
                      )
                    }
                    className={`w-full rounded-2xl px-5 py-4 text-left font-body transition ${
                      activeTab ===
                      item.id
                        ? "bg-primary text-white shadow-md"
                        : "border border-primary/10 text-primary hover:bg-background"
                    }`}
                  >
                    {item.label}
                  </button>
                )
              )}

              <Link
                to="/wishlist"
                className="block rounded-2xl border border-primary/10 px-5 py-4 font-body text-primary transition hover:bg-background"
              >
                My Wishlist
              </Link>

              <Link
                to="/shop"
                className="block rounded-2xl border border-primary/10 px-5 py-4 font-body text-primary transition hover:bg-background"
              >
                Continue Shopping
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-2xl bg-primary px-5 py-4 text-left font-body text-white transition hover:bg-[#4E3829]"
              >
                Logout
              </button>
            </nav>
          </aside>

          <div className="min-w-0">
            {activeTab ===
              "dashboard" && (
              <div className="space-y-8">
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    {
                      label:
                        "Total Orders",
                      value:
                        orderStats.total,
                    },
                    {
                      label:
                        "Active Orders",
                      value:
                        orderStats.active,
                    },
                    {
                      label:
                        "Delivered",
                      value:
                        orderStats.delivered,
                    },
                    {
                      label:
                        "Cancelled",
                      value:
                        orderStats.cancelled,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[28px] bg-white p-6 shadow-lg"
                    >
                      <p className="font-body text-sm text-[#75695F]">
                        {item.label}
                      </p>

                      <p className="mt-3 font-heading text-4xl font-semibold text-primary">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveTab(
                        "profile"
                      )
                    }
                    className="rounded-[30px] bg-white p-7 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <p className="font-body text-xs uppercase tracking-[0.25em] text-secondary">
                      Personal Details
                    </p>

                    <h2 className="mt-4 font-heading text-3xl font-semibold text-primary">
                      My Profile
                    </h2>

                    <p className="mt-3 font-body leading-7 text-[#75695F]">
                      Update your name and
                      phone number.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveTab(
                        "address"
                      )
                    }
                    className="rounded-[30px] bg-white p-7 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <p className="font-body text-xs uppercase tracking-[0.25em] text-secondary">
                      Delivery Details
                    </p>

                    <h2 className="mt-4 font-heading text-3xl font-semibold text-primary">
                      Address Book
                    </h2>

                    <p className="mt-3 font-body leading-7 text-[#75695F]">
                      Save your preferred
                      delivery address.
                    </p>
                  </button>
                </div>

                <div className="rounded-[30px] bg-white p-7 shadow-lg">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-body text-xs uppercase tracking-[0.25em] text-secondary">
                        Recent Orders
                      </p>

                      <h2 className="mt-3 font-heading text-3xl font-semibold text-primary">
                        Latest Activity
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setActiveTab(
                          "orders"
                        )
                      }
                      className="w-fit rounded-full border border-primary px-5 py-2.5 font-body text-sm text-primary transition hover:bg-primary hover:text-white"
                    >
                      View All Orders
                    </button>
                  </div>

                  {loadingOrders ? (
                    <p className="mt-8 font-body text-[#75695F]">
                      Loading orders...
                    </p>
                  ) : orders.length ===
                    0 ? (
                    <p className="mt-8 font-body text-[#75695F]">
                      No orders yet.
                    </p>
                  ) : (
                    <div className="mt-7 space-y-4">
                      {orders
                        .slice(0, 3)
                        .map(
                          (order) => (
                            <div
                              key={
                                order.id
                              }
                              className="flex flex-col gap-4 rounded-2xl bg-background p-5 sm:flex-row sm:items-center sm:justify-between"
                            >
                              <div>
                                <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary">
                                  Order
                                </p>

                                <p className="mt-2 font-body font-semibold text-primary">
                                  {String(
                                    order.id
                                  ).slice(
                                    0,
                                    8
                                  )}
                                </p>
                              </div>

                              <div className="flex flex-wrap items-center gap-4">
                                <span
                                  className={`rounded-full px-3 py-1 font-body text-xs ${getStatusClasses(
                                    order.status
                                  )}`}
                                >
                                  {order.status ||
                                    "Pending"}
                                </span>

                                <Link
                                  to={`/account/orders/${order.id}`}
                                  className="font-body text-sm font-semibold text-primary underline underline-offset-4"
                                >
                                  View Details
                                </Link>
                              </div>
                            </div>
                          )
                        )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab ===
              "profile" && (
              <form
                onSubmit={
                  handleSaveProfile
                }
                className="rounded-[30px] bg-white p-7 shadow-lg sm:p-9"
              >
                <p className="font-body text-xs uppercase tracking-[0.25em] text-secondary">
                  Personal Details
                </p>

                <h2 className="mt-4 font-heading text-4xl font-semibold text-primary">
                  My Profile
                </h2>

                <p className="mt-3 font-body text-[#75695F]">
                  Update your personal
                  information.
                </p>

                {loadingProfile ? (
                  <p className="mt-8 font-body text-[#75695F]">
                    Loading profile...
                  </p>
                ) : (
                  <div className="mt-8 grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="font-body text-sm font-medium text-primary">
                        Full Name
                      </label>

                      <input
                        type="text"
                        name="full_name"
                        value={
                          profile.full_name
                        }
                        onChange={
                          handleProfileChange
                        }
                        className="mt-3 w-full rounded-2xl border border-primary/15 bg-background px-5 py-4 font-body text-primary outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="font-body text-sm font-medium text-primary">
                        Phone Number
                      </label>

                      <input
                        type="tel"
                        name="phone"
                        value={
                          profile.phone
                        }
                        onChange={
                          handleProfileChange
                        }
                        maxLength={10}
                        placeholder="10-digit phone number"
                        className="mt-3 w-full rounded-2xl border border-primary/15 bg-background px-5 py-4 font-body text-primary outline-none focus:border-primary"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-body text-sm font-medium text-primary">
                        Email Address
                      </label>

                      <input
                        type="email"
                        value={
                          user.email || ""
                        }
                        readOnly
                        className="mt-3 w-full cursor-not-allowed rounded-2xl border border-primary/10 bg-gray-100 px-5 py-4 font-body text-[#75695F]"
                      />

                      <p className="mt-2 font-body text-xs text-[#918277]">
                        Your login email
                        cannot be changed
                        here.
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    savingProfile ||
                    loadingProfile
                  }
                  className="mt-8 rounded-full bg-primary px-8 py-4 font-body font-medium text-white transition hover:bg-[#4E3829] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingProfile
                    ? "Saving..."
                    : "Save Profile"}
                </button>
              </form>
            )}

            {activeTab ===
              "address" && (
              <form
                onSubmit={
                  handleSaveProfile
                }
                className="rounded-[30px] bg-white p-7 shadow-lg sm:p-9"
              >
                <p className="font-body text-xs uppercase tracking-[0.25em] text-secondary">
                  Delivery Details
                </p>

                <h2 className="mt-4 font-heading text-4xl font-semibold text-primary">
                  Address Book
                </h2>

                <p className="mt-3 font-body text-[#75695F]">
                  Save your preferred
                  delivery address for
                  future orders.
                </p>

                {loadingProfile ? (
                  <p className="mt-8 font-body text-[#75695F]">
                    Loading address...
                  </p>
                ) : (
                  <div className="mt-8 grid gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="font-body text-sm font-medium text-primary">
                        Address
                      </label>

                      <textarea
                        name="address"
                        value={
                          profile.address
                        }
                        onChange={
                          handleProfileChange
                        }
                        rows={4}
                        placeholder="House number, street and locality"
                        className="mt-3 w-full resize-none rounded-2xl border border-primary/15 bg-background px-5 py-4 font-body text-primary outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="font-body text-sm font-medium text-primary">
                        City
                      </label>

                      <input
                        type="text"
                        name="city"
                        value={
                          profile.city
                        }
                        onChange={
                          handleProfileChange
                        }
                        className="mt-3 w-full rounded-2xl border border-primary/15 bg-background px-5 py-4 font-body text-primary outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="font-body text-sm font-medium text-primary">
                        State
                      </label>

                      <input
                        type="text"
                        name="state"
                        value={
                          profile.state
                        }
                        onChange={
                          handleProfileChange
                        }
                        className="mt-3 w-full rounded-2xl border border-primary/15 bg-background px-5 py-4 font-body text-primary outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="font-body text-sm font-medium text-primary">
                        Pincode
                      </label>

                      <input
                        type="text"
                        name="pincode"
                        value={
                          profile.pincode
                        }
                        onChange={
                          handleProfileChange
                        }
                        maxLength={6}
                        placeholder="6-digit pincode"
                        className="mt-3 w-full rounded-2xl border border-primary/15 bg-background px-5 py-4 font-body text-primary outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="font-body text-sm font-medium text-primary">
                        Phone Number
                      </label>

                      <input
                        type="tel"
                        name="phone"
                        value={
                          profile.phone
                        }
                        onChange={
                          handleProfileChange
                        }
                        maxLength={10}
                        placeholder="Delivery contact number"
                        className="mt-3 w-full rounded-2xl border border-primary/15 bg-background px-5 py-4 font-body text-primary outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    savingProfile ||
                    loadingProfile
                  }
                  className="mt-8 rounded-full bg-primary px-8 py-4 font-body font-medium text-white transition hover:bg-[#4E3829] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingProfile
                    ? "Saving..."
                    : "Save Address"}
                </button>
              </form>
            )}

            {activeTab ===
              "orders" && (
              <div className="overflow-hidden rounded-[30px] bg-white shadow-lg">
                <div className="border-b border-primary/10 px-6 py-5">
                  <h2 className="font-heading text-3xl font-semibold text-primary">
                    My Orders
                  </h2>

                  <p className="mt-1 font-body text-sm text-[#75695F]">
                    Your Tashekari order
                    history.
                  </p>
                </div>

                {loadingOrders ? (
                  <div className="px-6 py-12 text-center font-body text-[#75695F]">
                    Loading your orders...
                  </div>
                ) : ordersError ? (
                  <div className="m-6 rounded-2xl bg-red-50 px-5 py-4 font-body text-red-600">
                    {ordersError}
                  </div>
                ) : orders.length ===
                  0 ? (
                  <div className="px-6 py-14 text-center">
                    <h3 className="font-heading text-3xl text-primary">
                      No Orders Yet
                    </h3>

                    <p className="mt-3 font-body text-sm text-[#75695F]">
                      Your orders will
                      appear here after
                      checkout.
                    </p>

                    <Link
                      to="/shop"
                      className="mt-6 inline-block rounded-full bg-primary px-6 py-3 font-body text-white transition hover:bg-[#4E3829]"
                    >
                      Explore Products
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-primary/10">
                    {orders.map(
                      (order) => (
                        <div
                          key={order.id}
                          className="p-6"
                        >
                          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                            <div>
                              <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary">
                                Order
                              </p>

                              <p className="mt-2 break-all font-body text-sm font-semibold text-primary">
                                {order.id}
                              </p>

                              <p className="mt-2 font-body text-sm text-[#75695F]">
                                {order.created_at
                                  ? new Date(
                                      order.created_at
                                    ).toLocaleDateString(
                                      "en-IN",
                                      {
                                        day: "2-digit",
                                        month:
                                          "short",
                                        year: "numeric",
                                      }
                                    )
                                  : "—"}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                              <div>
                                <p className="font-body text-xs text-[#817267]">
                                  Amount
                                </p>

                                <p className="mt-1 font-body font-semibold text-primary">
                                  ₹
                                  {Number(
                                    order.amount ||
                                      0
                                  ).toLocaleString(
                                    "en-IN"
                                  )}
                                </p>
                              </div>

                              <div>
                                <p className="font-body text-xs text-[#817267]">
                                  Payment
                                </p>

                                <p className="mt-1 font-body capitalize text-primary">
                                  {order.payment_method ||
                                    "—"}
                                </p>
                              </div>

                              <div>
                                <p className="font-body text-xs text-[#817267]">
                                  Payment Status
                                </p>

                                <span
                                  className={`mt-1 inline-block rounded-full px-3 py-1 font-body text-xs ${
                                    order.payment_status ===
                                    "paid"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-yellow-100 text-yellow-700"
                                  }`}
                                >
                                  {order.payment_status ||
                                    "pending"}
                                </span>
                              </div>

                              <div>
                                <p className="font-body text-xs text-[#817267]">
                                  Order Status
                                </p>

                                <span
                                  className={`mt-1 inline-block rounded-full px-3 py-1 font-body text-xs ${getStatusClasses(
                                    order.status
                                  )}`}
                                >
                                  {order.status ||
                                    "Pending"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {(order.courier_name ||
                            order.tracking_number) && (
                            <div className="mt-5 grid gap-3 rounded-2xl bg-background p-4 font-body text-sm sm:grid-cols-2">
                              <p className="text-[#75695F]">
                                Courier:{" "}
                                <span className="font-medium text-primary">
                                  {order.courier_name ||
                                    "—"}
                                </span>
                              </p>

                              <p className="text-[#75695F]">
                                Tracking:{" "}
                                <span className="font-medium text-primary">
                                  {order.tracking_number ||
                                    "—"}
                                </span>
                              </p>
                            </div>
                          )}

                          <div className="mt-5 flex justify-end">
                            <Link
                              to={`/account/orders/${order.id}`}
                              className="rounded-full bg-primary px-6 py-3 font-body text-sm font-medium text-white transition hover:bg-[#4E3829]"
                            >
                              View Order
                              Details
                            </Link>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}