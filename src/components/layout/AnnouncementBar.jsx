import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const messages = [
  "✨ Free Shipping on Orders Above ₹999",
  "🤎 Handmade with Love",
  "🌿 Sustainable & Eco-Friendly",
  "🚚 Dispatch Within 24 Hours",
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % messages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [paused]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative flex h-10 items-center justify-center overflow-hidden bg-gradient-to-r from-[#4E3829] via-[#6B4F3A] to-[#8A684F] px-4 text-white"
    >
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -left-10 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full bg-white blur-3xl" />
        <div className="absolute -right-10 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full bg-white blur-3xl" />
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={messages[index]}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative z-10 text-center font-body text-[10px] font-medium uppercase tracking-[0.18em] sm:text-xs md:text-sm md:tracking-[0.22em]"
        >
          {messages[index]}
        </motion.p>
      </AnimatePresence>

      <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-1">
        {messages.map((message, messageIndex) => (
          <span
            key={message}
            className={`h-1 rounded-full transition-all duration-300 ${
              messageIndex === index
                ? "w-4 bg-white"
                : "w-1 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}