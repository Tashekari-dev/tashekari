import { motion } from "framer-motion";

const values = [
  {
    icon: "🧵",
    title: "Handmade",
    text: "Every Tashekari creation is handcrafted with patience, care and attention to every knot.",
  },
  {
    icon: "🌿",
    title: "Sustainable",
    text: "We believe beautiful products should also respect nature through thoughtful materials and mindful production.",
  },
  {
    icon: "🤝",
    title: "Community",
    text: "Tashekari is built to create opportunities, encourage creativity and support skilled artisans.",
  },
  {
    icon: "❤️",
    title: "Made With Love",
    text: "Every piece carries a personal touch, making each order meaningful and unique.",
  },
];

export default function ValuesSection() {
  return (
    <section className="bg-background py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .7 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="font-body text-xs uppercase tracking-[0.35em] text-secondary">
            Our Values
          </p>

          <h2 className="mt-5 font-heading text-5xl md:text-6xl font-semibold text-primary">
            What We Believe
          </h2>

          <p className="mx-auto mt-5 max-w-2xl font-body leading-8 text-[#75695F]">
            Tashekari is built on craftsmanship, sustainability and creating
            meaningful opportunities through handmade art.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {values.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: .6, delay: index * .08 }}
              viewport={{ once: true }}
              className="rounded-[30px] bg-white p-8 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="text-5xl">
                {item.icon}
              </div>

              <h3 className="mt-6 font-heading text-3xl font-semibold text-primary">
                {item.title}
              </h3>

              <p className="mt-5 font-body leading-8 text-[#75695F]">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 rounded-[40px] bg-primary p-12 text-center shadow-2xl">

          <p className="font-body text-xs uppercase tracking-[0.35em] text-white/70">
            Our Mission
          </p>

          <h2 className="mt-5 font-heading text-5xl text-white font-semibold">
            Empowering Creativity Through Handmade Art
          </h2>

          <p className="mx-auto mt-6 max-w-3xl font-body leading-9 text-white/80">
            We dream of building a community where handmade craftsmanship creates
            meaningful employment, encourages learning new skills and inspires
            sustainable living for everyone.
          </p>

        </div>

      </div>
    </section>
  );
}