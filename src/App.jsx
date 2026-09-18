import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CustomOrder from "./pages/CustomOrder";
import PublicCollections from "./pages/Collections";
import CollectionDetails from "./pages/CollectionDetails";

import CustomerLogin from "./pages/CustomerLogin";
import CustomerAccount from "./pages/CustomerAccount";
import CustomerOrderDetails from "./pages/CustomerOrderDetails";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import ShippingPolicy from "./pages/ShippingPolicy";
import ReturnPolicy from "./pages/ReturnPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";

import Dashboard from "./pages/admin/Dashboard";
import AdminLogin from "./pages/admin/Login";
import Orders from "./pages/admin/Orders";
import CustomOrders from "./pages/admin/CustomOrders";
import Products from "./pages/admin/Products";
import AdminCollections from "./pages/admin/Collections";
import Coupons from "./pages/admin/Coupons";
import Settings from "./pages/admin/Settings";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import Reviews from "./pages/admin/Reviews";

import NotFound from "./pages/NotFound";

import WhatsAppButton from "./components/common/WhatsAppButton";
import ScrollProgress from "./components/common/ScrollProgress";
import CursorGlow from "./components/common/CursorGlow";
import ScrollToTop from "./components/common/ScrollToTop";
function App() {
  useEffect(() => {
    const timer = setTimeout(() => {
      
    }, 2200);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <CursorGlow />
      <ScrollProgress />
      <WhatsAppButton />
      <ScrollToTop />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        <Route path="/shop" element={<Shop />} />

        <Route
          path="/collections"
          element={<PublicCollections />}
        />

        <Route
          path="/collections/:slug"
          element={<CollectionDetails />}
        />

        <Route
          path="/product/:id"
          element={<Product />}
        />

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        <Route path="/cart" element={<Cart />} />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/order-success"
          element={<OrderSuccess />}
        />

        <Route path="/about" element={<About />} />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/custom-order"
          element={<CustomOrder />}
        />

        {/* Customer Authentication Routes */}
        <Route
          path="/login"
          element={<CustomerLogin />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* Customer Account Routes */}
        <Route
          path="/account"
          element={<CustomerAccount />}
        />

        <Route
          path="/account/orders/:id"
          element={<CustomerOrderDetails />}
        />

        {/* Policy Routes */}
        <Route
          path="/shipping-policy"
          element={<ShippingPolicy />}
        />

        <Route
          path="/return-policy"
          element={<ReturnPolicy />}
        />

        <Route
          path="/privacy-policy"
          element={<PrivacyPolicy />}
        />

        <Route
          path="/terms-and-conditions"
          element={<TermsConditions />}
        />

        {/* Admin Login */}
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/custom-orders"
          element={
            <ProtectedRoute>
              <CustomOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/collections"
          element={
            <ProtectedRoute>
              <AdminCollections />
            </ProtectedRoute>
          }
        />

        <Route
  path="/admin/coupons"
  element={
    <ProtectedRoute>
      <Coupons />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/reviews"
  element={
    <ProtectedRoute>
      <Reviews />
    </ProtectedRoute>
  }
/>

        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;