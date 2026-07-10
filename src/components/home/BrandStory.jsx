import { motion } from "framer-motion";
import bag12 from "../../assets/products/bag12.jpeg";

export default function BrandStory() {
  return (
    <section className="py-32 bg-[#F8F5F1] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">

        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-[#EAD7C4] rounded-full blur-[120px] opacity-70"></div>

          <img
            src={bag12}
            alt="Tashekari"
            className="relative rounded-[40px] shadow-2xl h-[620px] w-full object-cover"
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

          <h2 className="mt-6 text-6xl font-bold text-[#6B4F3A] leading-tight">
            Crafted By Hand,
            <br />
            Made With Love.
          </h2>

          <p className="mt-8 text-lg text-gray-600 leading-9">
            Every Tashekari creation is carefully handcrafted using
            sustainable cotton cords and timeless macrame techniques.

            We believe handmade products carry emotions, patience and
            craftsmanship that machines can never replace.
          </p>

          <div className="grid grid-cols-2 gap-8 mt-12">

            <div>
              <h3 className="text-5xl font-bold text-[#6B4F3A]">
                500+
              </h3>

              <p className="mt-3 text-gray-500">
                Happy Customers
              </p>
            </div>

            <div>
              <h3 className="text-5xl font-bold text-[#6B4F3A]">
                150+
              </h3>

              <p className="mt-3 text-gray-500">
                Handmade Designs
              </p>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}