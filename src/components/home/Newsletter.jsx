import { motion } from "framer-motion";

export default function Newsletter() {
  return (
    <section className="bg-white py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-[40px] bg-primary px-6 py-16 text-center shadow-2xl md:px-12 md:py-20"
        >
          <p className="font-body text-xs uppercase tracking-[0.38em] text-white/70">
            Stay Connected
          </p>

          <h2 className="mt-5 font-heading text-5xl font-semibold text-white md:text-6xl">
            Join the Tashekari Circle
          </h2>

          <p className="mx-auto mt-5 max-w-2xl font-body leading-8 text-white/80">
            Be the first to discover new handmade collections, gifting ideas
            and behind-the-scenes stories from our artisans.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="mx-auto mt-10 flex max-w-2xl flex-col gap-4 sm:flex-row"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full rounded-full border border-white/20 bg-white px-6 py-4 font-body text-primary outline-none placeholder:text-[#9A8D83]"
            />

            <button
              type="submit"
              className="rounded-full bg-secondary px-8 py-4 font-body font-medium text-white transition duration-300 hover:-translate-y-1 hover:bg-[#8F6846]"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}