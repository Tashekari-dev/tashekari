import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import mintMuseMacrameBag from "../../assets/products/mint-muse-macrame-bag.jpeg";
import accessoriesCollection from "../../assets/products/accessories-collection.jpeg";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background pt-32 pb-20">
      {/* Soft background glow */}
      <div className="absolute -left-40 top-24 h-96 w-96 rounded-full bg-light/70 blur-[130px]" />

      <div className="absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-secondary/20 blur-[140px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-20 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="relative z-10"
        >
          <p className="text-xs uppercase tracking-[0.45em] text-secondary md:text-sm">
            Handmade • Sustainable • Timeless
          </p>

          <h1 className="mt-7 font-heading text-6xl font-semibold leading-[0.9] text-primary sm:text-7xl lg:text-[104px]">
            Crafted
            <span className="block italic text-secondary">
              with love.
            </span>
          </h1>

          <p className="mt-8 max-w-xl font-body text-base leading-8 text-[#62584F] md:text-lg">
            Thoughtfully handcrafted macrame pieces created to bring warmth,
            personality and timeless beauty into your everyday life.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/shop"
              className="rounded-full bg-primary px-9 py-4 font-body text-sm font-medium text-white shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-[#4E3829]"
            >
              Shop Collection
            </Link>

            <a
              href="#our-story"
              className="rounded-full border border-primary px-9 py-4 font-body text-sm font-medium text-primary transition duration-300 hover:bg-primary hover:text-white"
            >
              Discover Our Story
            </a>
          </div>
        </motion.div>

        {/* RIGHT VISUAL AREA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.9,
            delay: 0.15,
            ease: "easeOut",
          }}
          className="relative min-h-[620px] md:min-h-[760px]"
        >
          {/* MAIN IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1,
              delay: 0.25,
              ease: "easeOut",
            }}
            className="group absolute right-6 top-0 h-[540px] w-[82%] overflow-hidden rounded-[42px] shadow-[0_30px_80px_rgba(0,0,0,0.18)] md:h-[680px]"
          >
            {/* Cinematic slow zoom */}
            <motion.img
              src={mintMuseMacrameBag}
              alt="Tashekari Mint Muse macrame bag"
              initial={{ scale: 1.02 }}
              animate={{ scale: [1.02, 1.06, 1.02] }}
              transition={{
                duration: 14,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-full w-full object-cover object-center transition-transform duration-1000 group-hover:scale-110"
            />

            {/* Soft overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

            {/* Light sweep */}
            <motion.div
              initial={{ x: "-120%" }}
              animate={{ x: "130%" }}
              transition={{
                duration: 3.5,
                delay: 1.2,
                repeat: Infinity,
                repeatDelay: 5,
                ease: "easeInOut",
              }}
              className="pointer-events-none absolute inset-y-0 w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/20 to-transparent blur-xl"
            />
          </motion.div>

          {/* SECOND IMAGE */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.55,
              ease: "easeOut",
            }}
            className="group absolute bottom-4 left-0 h-[280px] w-[48%] overflow-hidden rounded-[30px] border-[8px] border-background shadow-[0_25px_60px_rgba(0,0,0,0.18)] md:h-[350px]"
          >
            <motion.img
              src={accessoriesCollection}
              alt="Tashekari handcrafted accessories collection"
              initial={{ scale: 1.01 }}
              whileHover={{ scale: 1.08 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
              className="h-full w-full object-cover object-center"
            />

            {/* Soft overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-70" />
          </motion.div>

          {/* FLOATING MESSAGE CARD */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 0.4, 0],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-20 right-6 max-w-[280px] rounded-3xl border border-white/40 bg-white/90 px-6 py-5 shadow-2xl backdrop-blur-xl"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-secondary">
              Made by hand
            </p>

            <h3 className="mt-2 font-heading text-2xl font-semibold text-primary">
              Every knot has a story
            </h3>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}