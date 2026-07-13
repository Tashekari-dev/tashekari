import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaInstagram,
  FaPlay,
  FaTimes,
} from "react-icons/fa";

import insta1 from "../../assets/instagram/insta1.jpeg";
import insta2 from "../../assets/instagram/insta2.jpeg";
import insta3 from "../../assets/instagram/insta3.jpeg";
import insta4 from "../../assets/instagram/insta4.jpeg";
import insta5 from "../../assets/instagram/insta5.jpeg";
import insta6 from "../../assets/instagram/insta6.jpeg";
import insta7 from "../../assets/instagram/insta7.jpeg";
import video1 from "../../assets/instagram/video1.mp4";

const galleryItems = [
  {
    id: 1,
    type: "image",
    src: insta1,
    alt: "Tashekari handmade creation",
  },
  {
    id: 2,
    type: "image",
    src: insta2,
    alt: "Tashekari macrame collection",
  },
  {
    id: 3,
    type: "video",
    src: video1,
    alt: "Tashekari handmade process video",
  },
  {
    id: 4,
    type: "image",
    src: insta3,
    alt: "Tashekari handmade product",
  },
  {
    id: 5,
    type: "image",
    src: insta4,
    alt: "Tashekari macrame details",
  },
  {
    id: 6,
    type: "image",
    src: insta5,
    alt: "Tashekari sustainable handmade collection",
  },
  {
    id: 7,
    type: "image",
    src: insta6,
    alt: "Tashekari handcrafted design",
  },
  {
    id: 8,
    type: "image",
    src: insta7,
    alt: "Tashekari handmade lifestyle",
  },
];

export default function InstagramGallery() {
  const [selectedItem, setSelectedItem] = useState(null);

  function handleVideoEnter(event) {
    event.currentTarget.play().catch(() => {});
  }

  function handleVideoLeave(event) {
    event.currentTarget.pause();
    event.currentTarget.currentTime = 0;
  }

  function closePreview() {
    setSelectedItem(null);
  }

  return (
    <>
      <section className="overflow-hidden bg-white py-24 md:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="font-body text-xs uppercase tracking-[0.38em] text-secondary">
              Follow Our Journey
            </p>

            <h2 className="mt-5 font-heading text-5xl font-semibold text-primary md:text-6xl">
              Tashekari on Instagram
            </h2>

            <p className="mx-auto mt-5 max-w-2xl font-body leading-8 text-[#75695F]">
              Discover handmade moments, new collections and stories from behind
              every beautiful knot.
            </p>

            <a
              href="https://instagram.com/tashekari"
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-primary px-7 py-3 font-body text-sm font-medium text-primary transition duration-300 hover:-translate-y-1 hover:bg-primary hover:text-white"
            >
              <FaInstagram size={19} />
              Follow @tashekari
            </a>
          </motion.div>

          <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
            {galleryItems.map((item, index) => (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => setSelectedItem(item)}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.07,
                }}
                viewport={{ once: true }}
                className={`group relative overflow-hidden rounded-[22px] bg-background text-left shadow-md transition duration-500 hover:-translate-y-2 hover:shadow-2xl sm:rounded-[30px] ${
                  index === 0 || index === 5
                    ? "col-span-2 aspect-[2/1]"
                    : "aspect-square"
                }`}
                aria-label={`Open ${item.alt}`}
              >
                {item.type === "video" ? (
                  <>
                    <video
                      src={item.src}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      onMouseEnter={handleVideoEnter}
                      onMouseLeave={handleVideoLeave}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-primary shadow-xl backdrop-blur-md transition duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                        <FaPlay className="ml-1" size={18} />
                      </span>
                    </div>

                    <span className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-2 font-body text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur-md">
                      Reel
                    </span>
                  </>
                ) : (
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent opacity-60 transition duration-500 group-hover:opacity-90" />

                <div className="absolute inset-x-0 bottom-0 flex translate-y-3 items-center justify-between p-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:p-6">
                  <span className="font-body text-xs uppercase tracking-[0.22em] text-white">
                    View Post
                  </span>

                  <FaInstagram className="text-white" size={21} />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePreview}
            className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3 }}
              onClick={(event) => event.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-[28px] bg-black shadow-2xl"
            >
              <button
                type="button"
                onClick={closePreview}
                aria-label="Close preview"
                className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg transition hover:scale-110 hover:bg-primary hover:text-white"
              >
                <FaTimes size={18} />
              </button>

              {selectedItem.type === "video" ? (
                <video
                  src={selectedItem.src}
                  controls
                  autoPlay
                  muted
                  playsInline
                  className="max-h-[90vh] w-full object-contain"
                />
              ) : (
                <img
                  src={selectedItem.src}
                  alt={selectedItem.alt}
                  className="max-h-[90vh] w-full object-contain"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}