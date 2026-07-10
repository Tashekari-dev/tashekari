import { motion } from "framer-motion";

import bag12 from "../../assets/products/bag12.jpeg";
import bag13 from "../../assets/products/bag13.jpeg";
import bag14 from "../../assets/products/bag14.jpeg";
import keychain1 from "../../assets/products/keychain1.jpeg";
import pic2 from "../../assets/products/pic2.jpeg";
import pic3 from "../../assets/products/pic3.jpeg";

const gallery = [bag12, bag13, bag14, keychain1, pic2, pic3];

export default function InstagramGallery() {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="uppercase tracking-[0.35em] text-secondary text-sm">
            Follow Our Journey
          </p>

          <h2 className="mt-5 text-5xl md:text-6xl font-bold text-primary">
            Tashekari on Instagram
          </h2>

          <p className="mt-5 text-gray-500">
            Handmade moments, new collections and behind-the-scenes stories.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-14">
          {gallery.map((image, index) => (
            <motion.a
              key={index}
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-[28px] aspect-square"
            >
              <img
                src={image}
                alt={`Tashekari gallery ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 duration-700"
              />

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 duration-500"></div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
                <span className="text-white text-lg font-semibold">
                  View on Instagram
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}