import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import bag12 from "../../assets/products/bag12.jpeg";
import keychain1 from "../../assets/products/keychain1.jpeg";
import pic2 from "../../assets/products/pic2.jpeg";

const categories = [
  {
    name: "Macrame Bags",
    image: bag12,
    category: "Bags",
  },
  {
    name: "Keychains",
    image: keychain1,
    category: "Keychains",
  },
  {
    name: "Accessories",
    image: pic2,
    category: "Accessories",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 55,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut",
    },
  },
};

export default function Categories() {
  return (
    <section className="bg-white py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.25 }}
          className="text-center"
        >
          <p className="font-body text-xs uppercase tracking-[0.38em] text-secondary">
            Curated For You
          </p>

          <h2 className="mt-5 font-heading text-5xl font-semibold text-primary md:text-6xl">
            Shop Collections
          </h2>

          <p className="mx-auto mt-5 max-w-2xl font-body leading-8 text-[#75695F]">
            Explore thoughtfully handcrafted pieces designed for everyday beauty,
            meaningful gifting and warm living.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          className="mt-16 grid gap-8 md:grid-cols-3"
        >
          {categories.map((item) => (
            <motion.div
              key={item.name}
              variants={cardVariants}
              whileHover={{ y: -10 }}
            >
              <Link
                to={`/shop?category=${item.category}`}
                className="group block overflow-hidden rounded-[36px] bg-background shadow-lg transition duration-500 hover:shadow-2xl"
              >
                <div className="relative h-[480px] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                    <p className="font-body text-xs uppercase tracking-[0.3em] text-white/75">
                      Tashekari Collection
                    </p>

                    <h3 className="mt-3 font-heading text-4xl font-semibold">
                      {item.name}
                    </h3>

                    <span className="mt-5 inline-flex items-center gap-2 font-body text-sm">
                      Explore Collection
                      <span className="transition duration-300 group-hover:translate-x-2">
                        →
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}