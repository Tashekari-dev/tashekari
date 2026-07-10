import { motion } from "framer-motion";
import video1 from "../../assets/products/video1.mp4";

export default function VideoBanner() {
  return (
    <section className="bg-background py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative max-w-7xl mx-auto overflow-hidden rounded-[45px] shadow-2xl"
      >
        <video
          src={video1}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-[620px] object-cover"
        />

        <div className="absolute inset-0 bg-black/40"></div>

        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div className="max-w-3xl">
            <p className="uppercase tracking-[0.4em] text-white/80 text-sm">
              Handmade With Purpose
            </p>

            <h2 className="mt-6 text-5xl md:text-7xl font-bold text-white leading-tight">
              Every Knot Tells
              <br />
              A Story
            </h2>

            <p className="mt-6 text-lg md:text-xl text-white/90 leading-8">
              Discover the beauty of slow craftsmanship, sustainable materials
              and products made with patience, passion and love.
            </p>

            <a
              href="/shop"
              className="inline-block mt-10 bg-white text-primary px-9 py-4 rounded-full font-semibold hover:scale-105 duration-300"
            >
              Explore Collection
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}