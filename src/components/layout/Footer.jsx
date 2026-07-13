import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../../assets/logo/logo.png";

export default function Footer() {
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-[#2F2118] text-white"
    >
      <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-secondary/10 blur-[120px]" />
      <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-white/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1fr]">
          <div>
           <Link
  to="/"
  className="inline-flex items-center gap-4"
>
  <img
    src={logo}
    alt="Tashekari logo"
    className="h-16 w-16 object-contain"
  />

  <span className="font-heading text-4xl font-semibold tracking-wide md:text-5xl">
    Tashekari
  </span>
</Link>

            <p className="mt-6 max-w-md font-body leading-8 text-white/65">
              Thoughtfully handcrafted macrame pieces made with love,
              sustainable materials and timeless craftsmanship.
            </p>

            <p className="mt-6 font-body text-xs uppercase tracking-[0.3em] text-white/45">
              Handmade • Sustainable • Made With Love
            </p>

            <div className="mt-8 flex gap-3">
              <a
                href="https://instagram.com/tashekari"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-[#2F2118]"
              >
                <FaInstagram size={20} />
              </a>

              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-[#2F2118]"
              >
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-heading text-2xl font-semibold">
              Quick Links
            </h3>

            <ul className="mt-6 space-y-4 font-body text-sm text-white/60">
              <li>
                <Link to="/" className="transition hover:text-white">
                  Home
                </Link>
              </li>

              <li>
                <Link to="/shop" className="transition hover:text-white">
                  Shop
                </Link>
              </li>

              <li>
                <Link to="/about" className="transition hover:text-white">
                  About
                </Link>
              </li>

              <li>
                <Link to="/contact" className="transition hover:text-white">
                  Contact
                </Link>
              </li>

              <li>
                <Link to="/cart" className="transition hover:text-white">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-2xl font-semibold">
              Collections
            </h3>

            <ul className="mt-6 space-y-4 font-body text-sm text-white/60">
              <li>
                <Link
                  to="/shop?category=Bags"
                  className="transition hover:text-white"
                >
                  Macrame Bags
                </Link>
              </li>

              <li>
                <Link
                  to="/shop?category=Keychains"
                  className="transition hover:text-white"
                >
                  Keychains
                </Link>
              </li>

              <li>
                <Link
                  to="/shop?category=Accessories"
                  className="transition hover:text-white"
                >
                  Accessories
                </Link>
              </li>

              <li>
                <Link
                  to="/shop?category=Bookmarks"
                  className="transition hover:text-white"
                >
                  Bookmarks
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-2xl font-semibold">
              Stay Connected
            </h3>

            <p className="mt-6 font-body text-sm leading-7 text-white/60">
              Get updates about new collections, gifting ideas and handmade
              stories.
            </p>

            <form
              onSubmit={(event) => event.preventDefault()}
              className="mt-6 flex flex-col gap-3"
            >
              <input
                type="email"
                placeholder="Your email address"
                className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-4 font-body text-sm text-white outline-none placeholder:text-white/35 focus:border-secondary"
              />

              <button
                type="submit"
                className="rounded-full bg-secondary px-6 py-4 font-body text-sm font-medium text-white transition duration-300 hover:-translate-y-1 hover:bg-[#8F6846]"
              >
                Subscribe
              </button>
            </form>

            <div className="mt-7 space-y-3 font-body text-sm text-white/55">
              <p>India</p>
              <p>support@tashekari.com</p>
              <p>@tashekari</p>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-body text-xs text-white/40">
                © 2026 Tashekari. All Rights Reserved.
              </p>

              <div className="mt-3 flex flex-wrap gap-5 font-body text-xs text-white/45">
                <button type="button" className="transition hover:text-white">
                  Privacy Policy
                </button>

                <button type="button" className="transition hover:text-white">
                  Terms & Conditions
                </button>

                <button type="button" className="transition hover:text-white">
                  Shipping Policy
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-body text-[10px] text-white/50">
                  UPI
                </span>

                <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-body text-[10px] text-white/50">
                  Cards
                </span>

                <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-body text-[10px] text-white/50">
                  Net Banking
                </span>

                <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-body text-[10px] text-white/50">
                  COD
                </span>
              </div>

              <button
                type="button"
                onClick={scrollToTop}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-lg transition duration-300 hover:-translate-y-1 hover:bg-white hover:text-[#2F2118]"
                aria-label="Back to top"
              >
                ↑
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}