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

import ShippingPolicy from "./pages/ShippingPolicy";
import ReturnPolicy from "./pages/ReturnPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";

import Dashboard from "./pages/admin/Dashboard";
import Login from "./pages/admin/Login";
import ProtectedRoute from "./components/admin/ProtectedRoute";

import NotFound from "./pages/NotFound";

import WhatsAppButton from "./components/common/WhatsAppButton";
import ScrollProgress from "./components/common/ScrollProgress";
import CursorGlow from "./components/common/CursorGlow";
import ScrollToTop from "./components/common/ScrollToTop";
import PageLoader from "./components/common/PageLoader";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <>
      <CursorGlow />
      <ScrollProgress />
      <WhatsAppButton />
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/shop" element={<Shop />} />

        <Route path="/product/:id" element={<Product />} />

        <Route path="/wishlist" element={<Wishlist />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route path="/order-success" element={<OrderSuccess />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/custom-order" element={<CustomOrder />} />

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
        

        {/* Admin Dashboard */}
        <Route
  path="/admin/login"
  element={<Login />}
/>
        <Route
  path="/admin"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;