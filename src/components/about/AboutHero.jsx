import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import bag12 from "../../assets/products/bag12.jpeg";
import bag13 from "../../assets/products/bag13.jpeg";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-background pb-24 pt-36">
      <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-light/80 blur-[130px]" />
      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-secondary/20 blur-[140px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-body text-xs uppercase tracking-[0.4em] text-secondary">
            Our Journey
          </p>

          <h1 className="mt-6 font-heading text-6xl font-semibold leading-[0.95] text-primary md:text-7xl lg:text-[88px]">
            Every Knot
            <span className="block italic text-secondary">
              Tells A Story.
            </span>
          </h1>

          <p className="mt-8 max-w-xl font-body text-lg leading-9 text-[#6F6258]">
            Tashekari began during the pandemic with a simple wish to learn,
            create and build something meaningful. What started as one person
            learning macrame has now grown into a passionate team creating
            handmade pieces with love and purpose.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/shop"
              className="rounded-full bg-primary px-9 py-4 font-body font-medium text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-[#4E3829]"
            >
              Explore Collection
            </Link>

            <a
              href="#our-journey"
              className="rounded-full border border-primary px-9 py-4 font-body font-medium text-primary transition duration-300 hover:bg-primary hover:text-white"
            >
              Read Our Story
            </a>
          </div>

          <div className="mt-14 grid max-w-lg grid-cols-3 gap-5 border-t border-primary/15 pt-8">
            <div>
              <h2 className="font-heading text-4xl font-semibold text-primary">
                2020
              </h2>
              <p className="mt-1 font-body text-sm text-[#817267]">
                Journey Began
              </p>
            </div>

            <div>
              <h2 className="font-heading text-4xl font-semibold text-primary">
                500+
              </h2>
              <p className="mt-1 font-body text-sm text-[#817267]">
                Happy Customers
              </p>
            </div>

            <div>
              <h2 className="font-heading text-4xl font-semibold text-primary">
                100%
              </h2>
              <p className="mt-1 font-body text-sm text-[#817267]">
                Handmade
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="relative min-h-[620px]"
        >
          <div className="absolute right-0 top-0 h-[520px] w-[82%] overflow-hidden rounded-[42px] shadow-2xl">
            <img
              src={bag12}
              alt="Tashekari handmade macrame product"
              className="h-full w-full object-cover transition duration-700 hover:scale-105"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 45 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="absolute bottom-0 left-0 h-[280px] w-[48%] overflow-hidden rounded-[30px] border-[8px] border-background shadow-2xl"
          >
            <img
              src={bag13}
              alt="Tashekari handcrafted collection"
              className="h-full w-full object-cover"
            />
          </motion.div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-16 right-2 max-w-[260px] rounded-3xl bg-white/90 px-6 py-5 shadow-xl backdrop-blur-xl"
          >
            <p className="font-body text-xs uppercase tracking-[0.25em] text-secondary">
              Handmade With Purpose
            </p>

            <h3 className="mt-2 font-heading text-2xl font-semibold text-primary">
              From a hobby to a growing community
            </h3>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}