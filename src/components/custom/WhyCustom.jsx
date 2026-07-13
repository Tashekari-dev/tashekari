import { motion } from "framer-motion";
import {
  FaPalette,
  FaLeaf,
  FaHandsHelping,
  FaGift,
} from "react-icons/fa";

const features = [
  {
    icon: FaPalette,
    title: "Personalised Design",
    description:
      "Choose your preferred colours, size, style and details to create something truly personal.",
  },
  {
    icon: FaLeaf,
    title: "Sustainable Materials",
    description:
      "We use thoughtfully selected materials to create beautiful products with a mindful approach.",
  },
  {
    icon: FaHandsHelping,
    title: "Handcrafted With Care",
    description:
      "Every custom order is carefully made by hand with patience, creativity and attention to detail.",
  },
  {
    icon: FaGift,
    title: "Perfect For Gifting",
    description:
      "Create meaningful handmade gifts for birthdays, weddings, festive occasions and special moments.",
  },
];

export default function WhyCustom() {
  return (
    <section className="bg-white py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="font-body text-xs uppercase tracking-[0.38em] text-secondary">
            Why Choose Custom
          </p>

          <h2 className="mt-5 font-heading text-5xl font-semibold text-primary md:text-6xl">
            Made Around Your Vision
          </h2>

          <p className="mx-auto mt-5 max-w-2xl font-body leading-8 text-[#75695F]">
            From colours and dimensions to occasion and purpose, every custom
            piece is thoughtfully created around your requirements.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
                className="rounded-[30px] border border-primary/10 bg-background p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg">
                  <Icon size={22} />
                </div>

                <h3 className="mt-6 font-heading text-3xl font-semibold text-primary">
                  {feature.title}
                </h3>

                <p className="mt-4 font-body text-sm leading-7 text-[#75695F]">
                  {feature.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}