import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

const faqs = [
  {
    question: "How long does a custom order take?",
    answer:
      "Most custom orders take around 7–15 working days, depending on the design, size and quantity. We will confirm the exact timeline before starting your order.",
  },
  {
    question: "Can I choose the colour and size?",
    answer:
      "Yes. You can share your preferred colours, dimensions and style. We will guide you based on material availability and the selected product type.",
  },
  {
    question: "Do you accept bulk or gifting orders?",
    answer:
      "Yes. We accept bulk orders, festive gifting, wedding favours and customised hampers. Pricing and timelines depend on the required quantity.",
  },
  {
    question: "Can I send an inspiration image?",
    answer:
      "Yes. You can upload an inspiration image in the custom order form. We will use it only as a reference and create a handcrafted Tashekari version.",
  },
  {
    question: "Is advance payment required?",
    answer:
      "Yes. Custom orders usually require an advance payment before production begins. The payment amount and balance details will be shared after finalising the design.",
  },
  {
    question: "Can a custom order be cancelled?",
    answer:
      "Once production has started, custom orders usually cannot be cancelled because they are created specifically for you. Our team will confirm all details before beginning.",
  },
];

export default function CustomFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  function toggleFaq(index) {
    setOpenIndex((current) => (current === index ? -1 : index));
  }

  return (
    <section className="bg-white py-24 md:py-28">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="font-body text-xs uppercase tracking-[0.38em] text-secondary">
            Frequently Asked Questions
          </p>

          <h2 className="mt-5 font-heading text-5xl font-semibold text-primary md:text-6xl">
            Custom Order Questions
          </h2>

          <p className="mx-auto mt-5 max-w-2xl font-body leading-8 text-[#75695F]">
            Find answers about custom designs, timelines, payments and bulk
            orders.
          </p>
        </motion.div>

        <div className="mt-14 space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.06,
                }}
                viewport={{ once: true }}
                className="overflow-hidden rounded-[26px] border border-primary/10 bg-background"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between gap-5 px-6 py-6 text-left sm:px-8"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading text-2xl font-semibold text-primary">
                    {faq.question}
                  </span>

                  <FaChevronDown
                    size={15}
                    className={`shrink-0 text-secondary transition duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="border-t border-primary/10 px-6 py-6 font-body leading-8 text-[#75695F] sm:px-8">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}