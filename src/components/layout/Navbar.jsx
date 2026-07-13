import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

import AnnouncementBar from "./AnnouncementBar";
import logo from "../../assets/logo/logo.png";

export default function Navbar() {
  const { cartItems } = useCart();
  const { wishlistCount } = useWishlist();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const desktopLinkClass = ({ isActive }) =>
    `relative transition duration-300 after:absolute after:-bottom-2 after:left-0 after:h-px after:bg-secondary after:transition-all ${
      isActive
        ? "text-secondary after:w-full"
        : "text-primary hover:text-secondary after:w-0 hover:after:w-full"
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-primary/10 bg-background/95 shadow-[0_8px_30px_rgba(107,79,58,0.08)] backdrop-blur-xl"
          : "border-transparent bg-background/90 backdrop-blur-lg"
      }`}
    >
      <AnnouncementBar />

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 md:py-5 lg:px-10">
        <Link
  to="/"
  onClick={() => setMenuOpen(false)}
  className="flex items-center gap-2 sm:gap-3"
>
  <img
    src={logo}
    alt="Tashekari"
    className="h-10 w-10 object-contain sm:h-14 sm:w-14"
  />

  <span className="font-heading text-xl font-semibold text-primary sm:text-3xl">
    Tashekari
  </span>
</Link>

        <ul className="hidden items-center gap-9 font-body text-xs uppercase tracking-[0.24em] md:flex lg:gap-11">
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

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/shop"
            aria-label="Search products"
            className="hidden h-11 w-11 items-center justify-center rounded-full border border-primary/10 text-primary transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white md:flex"
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
          </Link>

          <Link
            to="/wishlist"
            aria-label="Open wishlist"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-primary/10 text-primary transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white"
          >
            <FaHeart size={18} />

            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-background bg-red-500 px-1 font-body text-[10px] text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
           className="relative rounded-full bg-primary px-4 py-3 font-body text-sm font-medium text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-[#4E3829] sm:px-6"
          >
            Cart

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-background bg-red-500 px-1 font-body text-[10px] text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-primary/15 text-primary transition hover:bg-primary hover:text-white md:hidden"
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
        className={`overflow-hidden border-t border-primary/10 bg-background transition-all duration-300 md:hidden ${
          menuOpen
            ? "max-h-[500px] opacity-100"
            : "max-h-0 border-transparent opacity-0"
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
            to="/wishlist"
            onClick={() => setMenuOpen(false)}
            className="border-b border-primary/10 py-4"
          >
            Wishlist
          </NavLink>

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

          <Link
            to="/shop"
            onClick={() => setMenuOpen(false)}
            className="mt-5 rounded-full border border-primary px-6 py-3 text-center text-xs tracking-[0.2em] transition hover:bg-primary hover:text-white"
          >
            Search Products
          </Link>
        </div>
      </div>
    </header>
  );
}