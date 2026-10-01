import { motion } from "framer-motion";
import { FaInstagram } from "react-icons/fa";

export default function InstagramGallery() {
  return (
    <section className="overflow-hidden bg-white py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="font-body text-xs uppercase tracking-[0.38em] text-secondary">
            Follow Our Journey
          </p>

          <h2 className="mt-5 font-heading text-5xl font-semibold text-primary md:text-6xl">
            Tashekari on Instagram
          </h2>

          <p className="mx-auto mt-5 max-w-2xl font-body leading-8 text-[#75695F]">
            Discover handmade moments, new collections and stories from behind
            every beautiful knot.
          </p>

          <a
            href="https://instagram.com/tashekari"
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-full border border-primary px-7 py-3 font-body text-sm font-medium text-primary transition duration-300 hover:-translate-y-1 hover:bg-primary hover:text-white"
          >
            <FaInstagram size={19} />
            Follow @tashekari
          </a>
        </motion.div>
      </div>
    </section>
  );
}