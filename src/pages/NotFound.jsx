import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background pt-28">
        <section className="flex min-h-[80vh] items-center justify-center px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full max-w-3xl rounded-[40px] bg-white p-10 text-center shadow-2xl md:p-16"
          >
            <p className="font-heading text-[110px] font-semibold leading-none text-secondary md:text-[150px]">
              404
            </p>

            <p className="mt-5 font-body text-xs uppercase tracking-[0.4em] text-secondary">
              Page Not Found
            </p>

            <h1 className="mt-5 font-heading text-5xl font-semibold text-primary md:text-6xl">
              This page has wandered away.
            </h1>

            <p className="mx-auto mt-6 max-w-xl font-body text-lg leading-8 text-[#75695F]">
              The page you are looking for does not exist or may have been moved.
              Let us take you back to something beautiful.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                to="/"
                className="rounded-full bg-primary px-9 py-4 font-body font-medium text-white transition duration-300 hover:-translate-y-1 hover:bg-[#4E3829]"
              >
                Back To Home
              </Link>

              <Link
                to="/shop"
                className="rounded-full border border-primary px-9 py-4 font-body font-medium text-primary transition duration-300 hover:bg-primary hover:text-white"
              >
                Explore Shop
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </>
  );
}