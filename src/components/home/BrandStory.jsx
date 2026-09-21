import { motion } from "framer-motion";
import earthboundTaupeSlingBag from "../../assets/products/earthbound-taupe-sling-bag.jpeg";

export default function BrandStory() {
  return (
    <section className="overflow-hidden bg-[#F8F5F1] py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-20 px-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute -left-10 -top-10 h-72 w-72 rounded-full bg-[#EAD7C4] opacity-70 blur-[120px]" />

          <img
            src={earthboundTaupeSlingBag}
            alt="Tashekari"
            className="h-full w-full object-cover object-center transition duration-700 hover:scale-105"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="uppercase tracking-[0.35em] text-[#A67C52]">
            Our Story
          </p>

          <h2 className="mt-6 text-6xl font-bold leading-tight text-[#6B4F3A]">
            Crafted By Hand,
            <br />
            Made With Love.
          </h2>

          <p className="mt-8 text-lg leading-9 text-gray-600">
            Every Tashekari creation is carefully handcrafted using
            sustainable cotton cords and timeless macrame techniques.
            We believe handmade products carry emotions, patience and
            craftsmanship that machines can never replace.
          </p>
        </motion.div>
      </div>
    </section>
  );
}


