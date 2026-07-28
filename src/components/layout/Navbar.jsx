import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaHeart, FaSignOutAlt, FaUser } from "react-icons/fa";

import { getProducts } from "../../services/productService.js";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";

import AnnouncementBar from "./AnnouncementBar";
import logo from "../../assets/logo/logo.png";
import toast from "react-hot-toast";

export default function Navbar() {
  const { cartItems } = useCart();
  const { wishlistCount } = useWishlist();

  const {
    user,
    isAuthenticated,
    authLoading,
    logout,
  } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);

  const searchRef = useRef(null);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const query = searchTerm.toLowerCase().trim();

    return products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
  }, [searchTerm, products]);
useEffect(() => {
  async function fetchProducts() {
    try {
      const productData = await getProducts();

      setProducts(productData);
    } catch (error) {
      console.error("Navbar search products error:", error);
    }
  }

  fetchProducts();
}, []);
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setSearchTerm("");
      }
    }

    function handleOutsideClick(event) {
      if (
        searchOpen &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setSearchOpen(false);
        setSearchTerm("");
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [searchOpen]);

  const desktopLinkClass = ({ isActive }) =>
    `relative transition duration-300 after:absolute after:-bottom-2 after:left-0 after:h-px after:bg-secondary after:transition-all ${
      isActive
        ? "text-secondary after:w-full"
        : "text-primary hover:text-secondary after:w-0 hover:after:w-full"
    }`;

  function closeSearch() {
    setSearchOpen(false);
    setSearchTerm("");
  }
 async function handleCustomerLogout() {
  try {
    await logout();
    setMenuOpen(false);

    toast.dismiss();
    toast.success("Logged out successfully.");
  } catch (error) {
    console.error("Customer logout error:", error);

    toast.dismiss();
    toast.error(error.message || "Unable to logout.");
  }
}

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-primary/10 bg-background/95 shadow-[0_8px_30px_rgba(107,79,58,0.08)] backdrop-blur-xl"
          : "border-transparent bg-background/90 backdrop-blur-lg"
      }`}
    >
      <AnnouncementBar />

      <nav className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-4 px-4 py-4 sm:px-6 md:py-5 lg:px-8 xl:px-10">
      <Link
  to="/"
  onClick={() => setMenuOpen(false)}
  className="flex shrink-0 items-center gap-2.5"
>
  <img
    src={logo}
    alt="Tashekari"
    className="h-11 w-11 rounded-full object-cover sm:h-12 sm:w-12 xl:h-14 xl:w-14"
  />

  <span className="font-heading text-2xl font-semibold text-primary sm:text-[1.7rem] xl:text-3xl">
    Tashekari
  </span>
</Link>

        <ul className="hidden min-w-0 flex-1 items-center justify-center gap-4 font-body text-[11px] uppercase tracking-[0.16em] lg:flex xl:gap-6 xl:text-xs xl:tracking-[0.2em] 2xl:gap-9">
          <li>
            <NavLink to="/" className={desktopLinkClass}>
              Home
            </NavLink>
          </li>

       <li>
  <NavLink to="/shop" className={desktopLinkClass}>
    Shop
  </NavLink>
</li>

<li>
  <NavLink to="/collections" className={desktopLinkClass}>
    Collections
  </NavLink>
</li>

<li>
  <NavLink to="/custom-order" className={desktopLinkClass}>
    Custom Orders
  </NavLink>
</li>
          <li>
            <NavLink to="/about" className={desktopLinkClass}>
              About
            </NavLink>
          </li>

          <li>
            <NavLink to="/contact" className={desktopLinkClass}>
              Contact
            </NavLink>
          </li>
        </ul>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 xl:gap-2.5">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search products"
            className="hidden h-11 w-11 items-center justify-center rounded-full border border-primary/10 text-primary transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white lg:flex"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth="1.8"
              />

              <path
                d="m16.3 16.3 4.2 4.2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <Link
            to="/wishlist"
            aria-label="Open wishlist"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-primary/10 text-primary transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white"
          >
            <FaHeart size={18} />

            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-background bg-red-500 px-1 font-body text-[10px] text-white">
                {wishlistCount}
              </span>
            )}
          </Link>
         {!authLoading &&
  (isAuthenticated ? (
    <>
      <Link
        to="/account"
        title={user?.email || "Customer account"}
        aria-label="Open customer account"
        className="hidden h-11 w-11 items-center justify-center rounded-full border border-primary/15 text-primary transition duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-white lg:flex"
      >
        <FaUser size={15} />
      </Link>

      <button
        type="button"
        onClick={handleCustomerLogout}
        title="Logout"
        aria-label="Logout"
        className="hidden h-11 w-11 items-center justify-center rounded-full border border-primary/15 text-primary transition duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-white lg:flex"
      >
        <FaSignOutAlt size={15} />
      </button>
    </>
  ) : (
    <Link
      to="/login"
      className="hidden rounded-full border border-primary/15 px-4 py-3 font-body text-xs font-medium text-primary transition duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-white lg:block"
    >
      Login
    </Link>
  ))}
          <Link
        
            to="/cart"
            className="relative rounded-full bg-primary px-4 py-3 font-body text-sm font-medium text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-[#4E3829] xl:px-5"
          >
            
            Cart

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-background bg-red-500 px-1 font-body text-[10px] text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-primary/15 text-primary transition hover:bg-primary hover:text-white lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-[1.5px] w-5 bg-current transition duration-300 ${
                  menuOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />

              <span
                className={`absolute left-0 top-[7px] h-[1.5px] w-5 bg-current transition duration-300 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />

              <span
                className={`absolute left-0 top-[14px] h-[1.5px] w-5 bg-current transition duration-300 ${
                  menuOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

     <div
  className={`overflow-y-auto border-t border-primary/10 bg-background transition-all duration-300 lg:hidden ${
    menuOpen
      ? "max-h-[calc(100vh-120px)] opacity-100"
      : "max-h-0 overflow-hidden border-transparent opacity-0"
  }`}
>
        <div className="flex flex-col px-6 py-6 font-body text-sm uppercase tracking-[0.2em] text-primary">
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className="border-b border-primary/10 py-4"
          >
            Home
          </NavLink>
<NavLink
  to="/shop"
  onClick={() => setMenuOpen(false)}
  className="border-b border-primary/10 py-4"
>
  Shop
</NavLink>

<NavLink
  to="/collections"
  onClick={() => setMenuOpen(false)}
  className="border-b border-primary/10 py-4"
>
  Collections
</NavLink>

<NavLink
  to="/custom-order"
  onClick={() => setMenuOpen(false)}
  className="border-b border-primary/10 py-4"
>
  Custom Orders
</NavLink>

          <NavLink
            to="/wishlist"
            onClick={() => setMenuOpen(false)}
            className="border-b border-primary/10 py-4"
          >
            Wishlist
          </NavLink>
          {!authLoading &&
  (isAuthenticated ? (
    <>
      <div className="border-b border-primary/10 py-4 normal-case tracking-normal">
        <p className="text-xs uppercase tracking-[0.2em] text-secondary">
          Signed in as
        </p>

        <p className="mt-2 break-all text-sm text-primary">
          {user?.email || "Customer"}
        </p>
      </div>
      <NavLink
  to="/account"
  onClick={() => setMenuOpen(false)}
  className="border-b border-primary/10 py-4"
>
  My Account
</NavLink>
      <button
        type="button"
        onClick={handleCustomerLogout}
        className="border-b border-primary/10 py-4 text-left uppercase tracking-[0.2em]"
      >
        Logout
      </button>
    </>
  ) : (
    <NavLink
      to="/login"
      onClick={() => setMenuOpen(false)}
      className="border-b border-primary/10 py-4"
    >
      Login
    </NavLink>
  ))}

          <NavLink
            to="/about"
            onClick={() => setMenuOpen(false)}
            className="border-b border-primary/10 py-4"
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="border-b border-primary/10 py-4"
          >
            Contact
          </NavLink>

          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              setSearchOpen(true);
            }}
            className="mt-5 rounded-full border border-primary px-6 py-3 text-center text-xs tracking-[0.2em] transition hover:bg-primary hover:text-white"
          >
            Search Products
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 px-4 pt-24 backdrop-blur-sm">
          <div
            ref={searchRef}
            className="w-full max-w-2xl overflow-hidden rounded-[30px] bg-white shadow-2xl"
          >
            <div className="flex items-center gap-4 border-b border-primary/10 p-5">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5 shrink-0 text-primary"
                aria-hidden="true"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />

                <path
                  d="m16.3 16.3 4.2 4.2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search handmade products..."
                autoFocus
                className="min-w-0 flex-1 bg-transparent font-body text-base text-primary outline-none placeholder:text-[#9B8E84]"
              />

              <button
                type="button"
                onClick={closeSearch}
                aria-label="Close search"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/10 text-xl text-primary transition hover:bg-primary hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="max-h-[420px] overflow-y-auto p-4">
              {!searchTerm.trim() ? (
                <div className="px-4 py-12 text-center">
                  <p className="font-heading text-3xl text-primary">
                    Search Tashekari
                  </p>

                  <p className="mt-3 font-body text-sm text-[#75695F]">
                    Search bags, keychains, accessories and bookmarks.
                  </p>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="space-y-2">
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      onClick={closeSearch}
                      className="flex items-center gap-4 rounded-2xl p-3 transition hover:bg-background"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-20 w-20 rounded-2xl object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="font-body text-xs uppercase tracking-[0.25em] text-secondary">
                          {product.category}
                        </p>

                        <h3 className="mt-1 truncate font-heading text-2xl text-primary">
                          {product.name}
                        </h3>

                        <p className="mt-1 font-body font-semibold text-primary">
                          {product.price}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-12 text-center">
                  <p className="font-heading text-3xl text-primary">
                    No Products Found
                  </p>

                  <p className="mt-3 font-body text-sm text-[#75695F]">
                    Try searching with another product name.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}