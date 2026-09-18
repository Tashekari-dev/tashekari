import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import heroImage from "../../assets/customisation/customisation-hero.png";

export default function CustomHero() {
  return (
    <section className="overflow-hidden bg-[#F8F5F1] py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:px-10">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-body text-xs uppercase tracking-[0.38em] text-secondary">
            Custom Made For You
          </p>

          <h1 className="mt-5 font-heading text-5xl font-semibold leading-tight text-primary md:text-7xl">
            Create Your Dream
            <span className="block italic text-secondary">
              Macrame Piece
            </span>
          </h1>

          <p className="mt-7 max-w-xl font-body text-base leading-8 text-[#75695F]">
            Share your idea, preferred colours and inspiration with us. We will
            thoughtfully handcraft a unique Tashekari creation made especially
            for you.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <a
              href="#custom-order-form"
              className="rounded-full bg-primary px-8 py-4 text-center font-body font-medium text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-[#4E3829]"
            >
              Start Custom Order
            </a>

            <Link
              to="/shop"
              className="rounded-full border border-primary px-8 py-4 text-center font-body font-medium text-primary transition duration-300 hover:bg-primary hover:text-white"
            >
              Explore Collection
            </Link>
          </div>

          <div className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-primary/10 pt-7">
            <div>
              <p className="font-heading text-3xl font-semibold text-primary">
                100%
              </p>

              <p className="mt-1 font-body text-xs text-[#75695F]">
                Handmade
              </p>
            </div>

            <div>
              <p className="font-heading text-3xl font-semibold text-primary">
                Custom
              </p>

              <p className="mt-1 font-body text-xs text-[#75695F]">
                Colours & Size
              </p>
            </div>

            <div>
              <p className="font-heading text-3xl font-semibold text-primary">
                Made
              </p>

              <p className="mt-1 font-body text-xs text-[#75695F]">
                With Love
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-[#C7A27A]/20 blur-[110px]" />

          <div className="relative overflow-hidden rounded-[40px] bg-white p-3 shadow-2xl">
            <img
              src={heroImage}
              alt="Custom Tashekari macrame creation"
              className="h-[520px] w-full rounded-[32px] object-contain bg-[#F8F5F1] md:h-[650px]"
            />

            <div className="absolute bottom-4 left-4 right-4 rounded-[22px] bg-white/90 px-4 py-4 shadow-xl backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-6 sm:px-5 sm:py-5">
              <p className="font-body text-[10px] uppercase tracking-[0.28em] text-secondary sm:text-xs">
                Your Idea, Our Craft
              </p>

              <h2 className="mt-1.5 font-heading text-xl font-semibold leading-tight text-primary sm:text-2xl">
                Designed especially for you
              </h2>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}