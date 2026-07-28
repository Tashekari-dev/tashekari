import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaImage,
  FaLayerGroup,
} from "react-icons/fa";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/common/ProductCard";
import { supabase } from "../lib/supabase";

export default function CollectionDetails() {
  const { slug } = useParams();

  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchCollectionDetails();
  }, [slug]);

  useEffect(() => {
    if (collection?.name) {
      document.title = `${collection.name} | Tashekari`;
    }

    return () => {
      document.title = "Tashekari";
    };
  }, [collection]);

  async function fetchCollectionDetails() {
    try {
      setLoading(true);
      setNotFound(false);
      setErrorMessage("");
      setCollection(null);
      setProducts([]);

      /*
       * Step 1:
       * URL slug ke through published collection fetch hogi.
       */
      const {
        data: collectionData,
        error: collectionError,
      } = await supabase
        .from("collections")
        .select("*")
        .eq("slug", slug)
        .eq("status", "Published")
        .eq("active", true)
        .maybeSingle();

      if (collectionError) {
        throw collectionError;
      }

      if (!collectionData) {
        setNotFound(true);
        return;
      }

      setCollection(collectionData);

      /*
       * Step 2:
       * Collection ke saath assigned product IDs fetch honge.
       */
      const {
        data: collectionProductRows,
        error: mappingError,
      } = await supabase
        .from("collection_products")
        .select("product_id, sort_order")
        .eq("collection_id", collectionData.id)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (mappingError) {
        throw mappingError;
      }

      if (
        !collectionProductRows ||
        collectionProductRows.length === 0
      ) {
        setProducts([]);
        return;
      }

      const productIds = collectionProductRows.map(
        (item) => item.product_id
      );

      /*
       * Step 3:
       * Product IDs ke through complete product data fetch hoga.
       */
      const {
        data: productsData,
        error: productsError,
      } = await supabase
        .from("products")
        .select("*")
        .in("id", productIds);

      if (productsError) {
        throw productsError;
      }

      /*
       * Products ko collection_products ke sort_order ke
       * according arrange kar rahe hain.
       */
      const productMap = new Map(
        (productsData || []).map((product) => [
          String(product.id),
          product,
        ])
      );

      const sortedProducts = productIds
        .map((productId) =>
          productMap.get(String(productId))
        )
        .filter(Boolean);

      setProducts(sortedProducts);
    } catch (error) {
      console.error(
        "Collection details fetch error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Collection load nahi ho payi. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const heroImage =
    collection?.banner_image ||
    collection?.cover_image ||
    "";

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="px-4 pb-20 pt-40 sm:px-6 sm:pt-44 lg:px-10">
          <div className="mx-auto flex min-h-[500px] max-w-7xl items-center justify-center rounded-[32px] border border-primary/10 bg-white">
            <div className="text-center">
              <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-[#E7D8CA] border-t-primary" />

              <p className="mt-5 font-body text-sm text-[#75695F]">
                Loading collection...
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="px-4 pb-20 pt-40 sm:px-6 sm:pt-44 lg:px-10">
          <section className="mx-auto flex min-h-[500px] max-w-4xl flex-col items-center justify-center rounded-[32px] border border-dashed border-[#D8C3B2] bg-white px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-background text-3xl text-secondary">
              <FaLayerGroup />
            </div>

            <p className="mt-7 font-body text-xs uppercase tracking-[0.3em] text-secondary">
              Collection Not Found
            </p>

            <h1 className="mt-4 font-heading text-4xl font-semibold text-primary sm:text-5xl">
              This Collection Is Unavailable
            </h1>

            <p className="mt-5 max-w-xl font-body text-sm leading-7 text-[#75695F] sm:text-base">
              This collection may have been removed, unpublished or
              the link may be incorrect.
            </p>

            <Link
              to="/collections"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 font-body text-sm font-medium text-white transition hover:-translate-y-1 hover:bg-secondary"
            >
              <FaArrowLeft size={13} />
              View All Collections
            </Link>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="px-4 pb-20 pt-40 sm:px-6 sm:pt-44 lg:px-10">
          <section className="mx-auto flex min-h-[450px] max-w-4xl flex-col items-center justify-center rounded-[32px] border border-red-100 bg-white px-6 text-center">
            <h1 className="font-heading text-4xl font-semibold text-primary">
              Unable to Load Collection
            </h1>

            <p className="mt-4 max-w-xl font-body text-sm leading-7 text-[#75695F]">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={fetchCollectionDetails}
              className="mt-7 rounded-full bg-primary px-7 py-4 font-body text-sm font-medium text-white transition hover:bg-secondary"
            >
              Try Again
            </button>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pb-24 pt-28 sm:pt-32">
        {/* Collection Hero */}
        <section className="px-4 sm:px-6 lg:px-10">
          <div className="relative mx-auto min-h-[560px] max-w-[1500px] overflow-hidden rounded-[36px] bg-[#EDE1D7] sm:min-h-[620px]">
            {heroImage ? (
              <img
                src={heroImage}
                alt={collection.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-7xl text-secondary/40">
                <FaImage />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            <div className="relative z-10 flex min-h-[560px] items-end px-6 py-10 sm:min-h-[620px] sm:px-12 sm:py-14 lg:px-16">
              <div className="max-w-3xl">
                <Link
                  to="/collections"
                  className="inline-flex items-center gap-3 rounded-full border border-white/40 bg-white/10 px-5 py-3 font-body text-xs font-medium uppercase tracking-[0.18em] text-white backdrop-blur-md transition hover:bg-white hover:text-primary"
                >
                  <FaArrowLeft size={11} />
                  All Collections
                </Link>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <p className="font-body text-xs uppercase tracking-[0.35em] text-white/80">
                    Tashekari Handmade Collection
                  </p>

                  {collection.featured && (
                    <span className="rounded-full bg-white px-4 py-2 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                      Featured
                    </span>
                  )}
                </div>

                <h1 className="mt-5 font-heading text-5xl font-semibold leading-tight text-white sm:text-6xl lg:text-7xl">
                  {collection.name}
                </h1>

                <p className="mt-6 max-w-2xl font-body text-sm leading-7 text-white/85 sm:text-base sm:leading-8">
                  {collection.description ||
                    "Discover this thoughtfully curated handmade collection by Tashekari."}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <span className="rounded-full border border-white/35 bg-white/10 px-5 py-3 font-body text-xs uppercase tracking-[0.16em] text-white backdrop-blur-md">
                    {products.length}{" "}
                    {products.length === 1
                      ? "Product"
                      : "Products"}
                  </span>

                  <span className="rounded-full border border-white/35 bg-white/10 px-5 py-3 font-body text-xs uppercase tracking-[0.16em] text-white backdrop-blur-md">
                    Handmade with Love
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Collection Products */}
        <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col gap-5 border-b border-primary/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-body text-xs uppercase tracking-[0.3em] text-secondary">
                Explore The Collection
              </p>

              <h2 className="mt-3 font-heading text-4xl font-semibold text-primary sm:text-5xl">
                Handmade Products
              </h2>

              <p className="mt-4 max-w-2xl font-body text-sm leading-7 text-[#75695F]">
                Explore products carefully selected for{" "}
                {collection.name}.
              </p>
            </div>

            <p className="font-body text-sm text-[#75695F]">
              {products.length}{" "}
              {products.length === 1
                ? "product"
                : "products"}
            </p>
          </div>

          {products.length === 0 ? (
            <div className="mt-12 flex min-h-[380px] flex-col items-center justify-center rounded-[32px] border border-dashed border-[#D8C3B2] bg-white px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background text-2xl text-secondary">
                <FaLayerGroup />
              </div>

              <h3 className="mt-5 font-heading text-3xl font-semibold text-primary">
                Products Coming Soon
              </h3>

              <p className="mt-3 max-w-lg font-body text-sm leading-7 text-[#75695F]">
                Products are being prepared for this collection.
                Please explore our complete shop in the meantime.
              </p>

              <Link
                to="/shop"
                className="mt-7 rounded-full bg-primary px-7 py-4 font-body text-sm font-medium text-white transition hover:-translate-y-1 hover:bg-secondary"
              >
                Explore Shop
              </Link>
            </div>
          ) : (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  image={product.image}
                  name={product.name}
                  price={`₹${Number(
                    product.price
                  ).toLocaleString("en-IN")}`}
                  category={product.category}
                  bestseller={Boolean(product.bestseller)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}