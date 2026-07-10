import { motion } from "framer-motion";

const reviews = [
  {
    name: "Ayesha Khan",
    text: "Tashekari ke products bahut beautifully handcrafted hain. Quality aur finishing dono premium hain.",
  },
  {
    name: "Riya Sharma",
    text: "Maine macrame bag order kiya tha. Product exactly photo jaisa tha aur packaging bhi bahut pyari thi.",
  },
  {
    name: "Neha Verma",
    text: "Handmade gifting ke liye Tashekari perfect hai. Unique designs aur lovely detailing.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-28 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="uppercase tracking-[0.35em] text-secondary text-sm">
            Customer Love
          </p>

          <h2 className="mt-5 text-5xl md:text-6xl font-bold text-primary">
            What Our Customers Say
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              viewport={{ once: true }}
              className="bg-white rounded-[30px] p-8 shadow-lg hover:shadow-2xl duration-500"
            >
              <div className="text-secondary text-2xl tracking-widest">
                ★★★★★
              </div>

              <p className="mt-6 text-gray-600 leading-8">
                “{review.text}”
              </p>

              <h3 className="mt-8 text-2xl font-bold text-primary">
                {review.name}
              </h3>

              <p className="mt-1 text-sm text-gray-400">
                Verified Customer
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}