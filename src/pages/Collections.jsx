import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaImage, FaLayerGroup } from "react-icons/fa";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { supabase } from "../lib/supabase";

export default function Collections() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
  }, []);

  async function fetchCollections() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .eq("status", "Published")
        .eq("active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setCollections(data || []);
    } catch (error) {
      console.error("Public collections fetch error:", error);
      setCollections([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pb-20 pt-40 sm:pt-44">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-body text-xs uppercase tracking-[0.35em] text-secondary">
              Curated by Tashekari
            </p>

            <h1 className="mt-4 font-heading text-5xl font-semibold text-primary sm:text-6xl">
              Our Collections
            </h1>

            <p className="mx-auto mt-5 max-w-2xl font-body text-sm leading-7 text-[#75695F] sm:text-base">
              Thoughtfully curated handmade collections designed to
              bring warmth, personality and timeless craft into your
              everyday life.
            </p>
          </div>

          <div className="mt-14">
            {loading ? (
              <div className="flex min-h-[350px] items-center justify-center rounded-[30px] border border-primary/10 bg-white">
                <p className="font-body text-sm text-[#75695F]">
                  Loading collections...
                </p>
              </div>
            ) : collections.length === 0 ? (
              <div className="flex min-h-[380px] flex-col items-center justify-center rounded-[30px] border border-dashed border-[#D8C3B2] bg-white px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background text-2xl text-secondary">
                  <FaLayerGroup />
                </div>

                <h2 className="mt-5 font-heading text-3xl font-semibold text-primary">
                  Collections Coming Soon
                </h2>

                <p className="mt-3 max-w-md font-body text-sm leading-6 text-[#75695F]">
                  We are preparing beautiful handmade collections for
                  you. Please check again soon.
                </p>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {collections.map((collection) => (
                  <Link
                    key={collection.id}
                    to={`/collections/${collection.slug}`}
                    className="group block overflow-hidden rounded-[30px] border border-primary/10 bg-white shadow-[0_12px_40px_rgba(107,79,58,0.08)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_22px_55px_rgba(107,79,58,0.14)]"
                  >
                    <div className="relative h-[360px] overflow-hidden bg-[#F1E8E0]">
                      {collection.cover_image ? (
                        <img
                          src={collection.cover_image}
                          alt={collection.name}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-5xl text-secondary">
                          <FaImage />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />

                      {collection.featured && (
                        <span className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-primary backdrop-blur-md">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="p-7">
                      <p className="font-body text-[10px] uppercase tracking-[0.3em] text-secondary">
                        Handmade Collection
                      </p>

                      <h2 className="mt-3 font-heading text-3xl font-semibold text-primary">
                        {collection.name}
                      </h2>

                      <p className="mt-4 line-clamp-3 min-h-[72px] font-body text-sm leading-6 text-[#75695F]">
                        {collection.description ||
                          "Discover this thoughtfully curated handmade collection by Tashekari."}
                      </p>

                      <div className="mt-6 flex items-center justify-between border-t border-primary/10 pt-5">
                        <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                          Explore Collection
                        </p>

                        <span className="font-body text-xl text-primary transition duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}