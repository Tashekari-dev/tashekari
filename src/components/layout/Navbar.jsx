import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const { cartItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-primary/10 bg-background/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link
          to="/"
          className="font-heading text-3xl font-semibold tracking-wide text-primary md:text-4xl"
        >
          Tashekari
        </Link>

        <ul className="hidden items-center gap-10 font-body text-xs uppercase tracking-[0.25em] text-primary md:flex">
          <li>
            <Link
              to="/"
              className="relative transition hover:text-secondary after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-secondary after:transition-all hover:after:w-full"
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              to="/shop"
              className="relative transition hover:text-secondary after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-secondary after:transition-all hover:after:w-full"
            >
              Shop
            </Link>
          </li>

          <li>
            <a
              href="/#our-story"
              className="relative transition hover:text-secondary after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-secondary after:transition-all hover:after:w-full"
            >
              About
            </a>
          </li>

          <li>
            <a
              href="/#contact"
              className="relative transition hover:text-secondary after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-secondary after:transition-all hover:after:w-full"
            >
              Contact
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-3">
          <button className="hidden rounded-full px-4 py-2 font-body text-xs uppercase tracking-[0.2em] text-primary transition hover:bg-cream md:block">
            Search
          </button>

          <Link
            to="/cart"
            className="relative rounded-full bg-primary px-6 py-3 font-body text-sm font-medium text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#4E3829]"
          >
            Cart

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/15 text-primary md:hidden"
            aria-label="Toggle menu"
          >
            <span className="text-xl">{menuOpen ? "×" : "☰"}</span>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-primary/10 bg-background px-6 py-6 md:hidden">
          <div className="flex flex-col gap-5 font-body text-sm uppercase tracking-[0.2em] text-primary">
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>

            <Link to="/shop" onClick={() => setMenuOpen(false)}>
              Shop
            </Link>

            <a href="/#our-story" onClick={() => setMenuOpen(false)}>
              About
            </a>

            <a href="/#contact" onClick={() => setMenuOpen(false)}>
              Contact
            </a>
          </div>
        </div>
      )}
    </header>
  );
}