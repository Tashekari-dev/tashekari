import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#2F2118] text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 lg:grid-cols-4 lg:px-10">
        
        <div>
          <Link
            to="/"
            className="font-heading text-5xl font-semibold tracking-wide"
          >
            Tashekari
          </Link>

          <p className="mt-6 max-w-sm font-body leading-8 text-white/65">
            Handmade macrame creations crafted with love, purpose and
            sustainable materials.
          </p>

          <p className="mt-6 font-body text-sm text-white/50">
            Handmade • Sustainable • Made with Love
          </p>
        </div>

        <div>
          <h3 className="font-heading text-2xl font-semibold">
            Quick Links
          </h3>

          <ul className="mt-6 space-y-4 font-body text-sm text-white/65">
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
              <a href="/#our-story" className="transition hover:text-white">
                Our Story
              </a>
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

          <ul className="mt-6 space-y-4 font-body text-sm text-white/65">
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
            Contact
          </h3>

          <div className="mt-6 space-y-4 font-body text-sm text-white/65">
            <p>India</p>
            <p>support@tashekari.com</p>
            <p>Instagram: @tashekari</p>
          </div>

          <div className="mt-8 flex gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition hover:bg-white hover:text-[#2F2118]"
              aria-label="Instagram"
            >
              IG
            </a>

            <a
              href="https://wa.me/"
              target="_blank"
              rel="noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition hover:bg-white hover:text-[#2F2118]"
              aria-label="WhatsApp"
            >
              WA
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-center font-body text-xs text-white/45 md:flex-row md:items-center md:justify-between md:text-left lg:px-10">
          <p>© 2026 Tashekari. All Rights Reserved.</p>

          <div className="flex justify-center gap-6">
            <button type="button" className="hover:text-white">
              Privacy Policy
            </button>

            <button type="button" className="hover:text-white">
              Terms & Conditions
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}