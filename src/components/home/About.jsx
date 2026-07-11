import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import bag14 from "../../assets/products/bag14.jpeg";

export default function About() {
  return (
    <section id="our-story" className="overflow-hidden bg-background py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 md:grid-cols-2 lg:px-10">
        <motion.div
          initial={{ opacity: 0, x: -55 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.25 }}
          className="relative"
        >
          <div className="absolute -left-10 -top-10 h-72 w-72 rounded-full bg-light/80 blur-[120px]" />

          <div className="relative overflow-hidden rounded-[40px] shadow-2xl">
            <img
              src={bag14}
              alt="Tashekari handmade macrame craftsmanship"
              loading="lazy"
              className="h-[560px] w-full object-cover transition duration-700 hover:scale-105"
            />
          </div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -bottom-6 right-4 max-w-[250px] rounded-3xl border border-white/50 bg-white/90 px-6 py-5 shadow-xl backdrop-blur-xl md:-right-6"
          >
            <p className="font-body text-xs uppercase tracking-[0.25em] text-secondary">
              Our Purpose
            </p>

            <h3 className="mt-2 font-heading text-2xl font-semibold text-primary">
              Creating beauty, skills and opportunities
            </h3>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 55 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.25 }}
        >
          <p className="font-body text-xs uppercase tracking-[0.38em] text-secondary">
            About Tashekari
          </p>

          <h2 className="mt-5 font-heading text-5xl font-semibold leading-tight text-primary md:text-6xl">
            Handmade with
            <span className="block italic text-secondary">passion and purpose.</span>
          </h2>

          <p className="mt-8 font-body text-base leading-8 text-[#6F6258]">
            Tashekari began during Covid with a simple desire to learn something
            creative and meaningful. What started as one person exploring
            macrame slowly grew into a team creating thoughtful handmade pieces.
          </p>

          <p className="mt-5 font-body text-base leading-8 text-[#6F6258]">
            Every knot is shaped with care, and every purchase supports
            craftsmanship, skill development and meaningful opportunities for
            people who want to create, learn and grow.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-5">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="font-heading text-4xl font-semibold text-primary">
                500+
              </h3>
              <p className="mt-2 font-body text-sm text-[#817267]">
                Happy Customers
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="font-heading text-4xl font-semibold text-primary">
                150+
              </h3>
              <p className="mt-2 font-body text-sm text-[#817267]">
                Handmade Designs
              </p>
            </div>
          </div>

          <Link
            to="/about"
            className="mt-10 inline-flex rounded-full bg-primary px-9 py-4 font-body text-sm font-medium text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-[#4E3829]"
          >
            Discover Our Story
          </Link>
        </motion.div>
      </div>
    </section>
  );
}