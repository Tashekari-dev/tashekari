import { motion } from "framer-motion";
import logo from "../../assets/logo/logo.png";

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#F8F5F1]">

      <div className="text-center">

        <motion.img
          src={logo}
          alt="Tashekari"
          className="mx-auto h-28 w-28 object-contain"
          animate={{
            scale: [0.9, 1.05, 1],
            opacity: [0, 1, 1],
            rotate: [0, 3, -3, 0],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
          }}
        />

        <motion.h2
          className="mt-5 font-heading text-3xl text-[#6B4F3A]"
          animate={{
            opacity: [0, 1, 0.6, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          Tashekari
        </motion.h2>

        <p className="mt-2 text-sm tracking-[0.35em] uppercase text-[#A67C52]">
          Handmade • Sustainable • Luxury
        </p>

      </div>

    </div>
  );
}