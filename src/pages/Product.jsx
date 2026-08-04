import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaLink,
  FaTimes,
  FaWhatsapp,
} from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { getProductById } from "../services/productService.js";
import { supabase } from "../lib/supabase.js";
import { useCart } from "../context/CartContext";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/common/ProductCard";

function normalizeGalleryImages(product) {
  if (!product) return [];

  let galleryImages = [];

  if (Array.isArray(product.images)) {
    galleryImages = product.images;
  } else if (typeof product.images === "string" && product.images.trim()) {
    try {
      const parsedImages = JSON.parse(product.images);
      galleryImages = Array.isArray(parsedImages) ? parsedImages : [];
    } catch {
      galleryImages = [];
    }
  }

  return [...new Set([product.image, ...galleryImages].filter(Boolean))];
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim()).filter(Boolean);
  }

  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

function formatPrice(price) {
  if (price === null || price === undefined || price === "") {
    return "₹0";
  }

  // Agar price pehle se ₹ ke saath string hai
  if (typeof price === "string") {
    if (price.includes("₹")) {
      return price;
    }

    const cleaned = Number(price.replace(/,/g, ""));

    if (!Number.isNaN(cleaned)) {
      return `₹${cleaned.toLocaleString("en-IN")}`;
    }

    return price;
  }

  return `₹${Number(price).toLocaleString("en-IN")}`;
}

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const [product, setProduct] = useState(null);
 
  const [products, setProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeImage, setActiveImage] = useState("");
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
const [loadingReviews, setLoadingReviews] = useState(true);

  const galleryImages = useMemo(
    () => normalizeGalleryImages(product),
    [product]
  );

  const tags = useMemo(() => normalizeTags(product?.tags), [product]);

  const stock = Number(product?.stock || 0);
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    return products
      .filter(
        (item) =>
          item.category === product.category &&
          String(item.id) !== String(product.id)
      )
      .slice(0, 3);
  }, [product, products]);

  const activeImageIndex = useMemo(
    () => galleryImages.findIndex((image) => image === activeImage),
    [galleryImages, activeImage]
  );
  const reviewCount = reviews.length;

const averageRating = useMemo(() => {
  if (reviewCount === 0) {
    return 0;
  }

  const totalRating = reviews.reduce(
    (total, review) =>
      total + Number(review.rating || 0),
    0
  );

  return totalRating / reviewCount;
}, [reviews, reviewCount]);

function renderRatingStars(rating) {
  const roundedRating = Math.round(
    Number(rating || 0)
  );

  return Array.from(
    { length: 5 },
    (_, index) => (
      <span
        key={index}
        className={
          index < roundedRating
            ? "text-yellow-500"
            : "text-gray-300"
        }
      >
        ★
      </span>
    )
  );
}

  useEffect(() => {
    async function fetchProductData() {
      try {
        setLoading(true);
        setProduct(null);
        setQuantity(1);
        setActiveTab("description");

        const [{ data: productsData, error: productsError }, selectedProduct] =
          await Promise.all([
            supabase
              .from("products")
              .select("*")
              .order("created_at", { ascending: false }),
            getProductById(id),
          ]);

        if (productsError) throw productsError;

        const allProducts = productsData || [];
        setProducts(allProducts);

        const finalProduct =
          selectedProduct ||
          allProducts.find((item) => String(item.id) === String(id)) ||
          null;

        setProduct(finalProduct);
      } catch (error) {
        console.error("Product fetch error:", error);

        try {
          const { data, error: fallbackError } = await supabase
            .from("products")
            .select("*")
            .eq("id", id)
            .maybeSingle();

          if (fallbackError) throw fallbackError;

          setProduct(data || null);
        } catch (fallbackError) {
          console.error("Product fallback fetch error:", fallbackError);
          setProduct(null);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProductData();
  }, [id]);
  useEffect(() => {
  async function fetchApprovedReviews() {
    if (!id) {
      setReviews([]);
      setLoadingReviews(false);
      return;
    }

    try {
      setLoadingReviews(true);

      const { data, error: reviewsError } =
        await supabase
          .from("product_reviews")
          .select(
            `
              id,
              product_id,
              customer_name,
              rating,
              review_text,
              created_at
            `
          )
          .eq("product_id", String(id))
          .eq("approved", true)
          .order("created_at", {
            ascending: false,
          });

      if (reviewsError) {
        throw reviewsError;
      }

      setReviews(data || []);
    } catch (reviewsError) {
      console.error(
        "Approved reviews fetch error:",
        reviewsError
      );

      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  }

  fetchApprovedReviews();
}, [id]);

  useEffect(() => {
    if (!product) {
      setActiveImage("");
      return;
    }

    const images = normalizeGalleryImages(product);
    setActiveImage(images[0] || "");
  }, [product]);

  useEffect(() => {
    if (!product) return;

    try {
      const savedProducts = localStorage.getItem("recent-products");
      const viewedProducts = savedProducts
        ? JSON.parse(savedProducts)
        : [];

      const previousProducts = Array.isArray(viewedProducts)
        ? viewedProducts
        : [];

      setRecentProducts(
        previousProducts
          .filter((item) => String(item.id) !== String(product.id))
          .slice(0, 3)
      );

      const filteredProducts = previousProducts.filter(
        (item) => String(item.id) !== String(product.id)
      );

      const productToStore = {
        id: product.id,
        image: product.image,
        name: product.name,
        price: product.price,
        category: product.category,
        bestseller: product.bestseller,
      };

      localStorage.setItem(
        "recent-products",
        JSON.stringify([productToStore, ...filteredProducts].slice(0, 6))
      );
    } catch (error) {
      console.error("Unable to save recently viewed products:", error);
    }
  }, [product]);

  useEffect(() => {
    if (!isImagePreviewOpen) return undefined;

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsImagePreviewOpen(false);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isImagePreviewOpen]);

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increaseQuantity() {
    setQuantity((current) => Math.min(Math.max(stock, 1), current + 1));
  }

  function handleAddToCart() {
    if (!product || isOutOfStock) {
      toast.dismiss();
      toast.error("This product is currently out of stock.");
      return;
    }

    for (let count = 0; count < quantity; count += 1) {
      addToCart(product);
    }

    setAdded(true);
    toast.dismiss();
    toast.success(`${quantity} item${quantity > 1 ? "s" : ""} added to cart.`);

    window.setTimeout(() => {
      setAdded(false);
    }, 1800);
  }

  function handleBuyNow() {
    if (!product || isOutOfStock) {
      toast.dismiss();
      toast.error("This product is currently out of stock.");
      return;
    }

    for (let count = 0; count < quantity; count += 1) {
      addToCart(product);
    }

    navigate("/checkout");
  }

  function shareWhatsApp() {
    const url = window.location.href;

    const message = `Check out this handmade product from Tashekari ❤️

${product.name}
${formatPrice(product.price)}

${url}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.dismiss();
      toast.success("Product link copied successfully.");
    } catch (error) {
      console.error("Unable to copy product link:", error);
      toast.dismiss();
      toast.error("Unable to copy the link. Please copy it from the address bar.");
    }
  }

  function showPreviousImage() {
    if (galleryImages.length <= 1) return;

    const currentIndex = activeImageIndex >= 0 ? activeImageIndex : 0;
    const previousIndex =
      currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1;

    setActiveImage(galleryImages[previousIndex]);
  }

  function showNextImage() {
    if (galleryImages.length <= 1) return;

    const currentIndex = activeImageIndex >= 0 ? activeImageIndex : 0;
    const nextIndex =
      currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1;

    setActiveImage(galleryImages[nextIndex]);
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-screen items-center justify-center bg-background px-6 pt-28">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            <h2 className="mt-5 font-heading text-3xl font-semibold text-primary">
              Loading product...
            </h2>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-screen items-center justify-center bg-background px-6 pt-28 text-center">
          <div>
            <p className="font-body text-sm uppercase tracking-[0.35em] text-secondary">
              Tashekari
            </p>

            <h1 className="mt-5 font-heading text-5xl font-semibold text-primary">
              Product Not Found
            </h1>

            <Link
              to="/shop"
              className="mt-8 inline-block rounded-full bg-primary px-8 py-4 font-body text-white transition hover:bg-[#4E3829]"
            >
              Back To Shop
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="bg-background pt-28">
        <section className="py-12 md:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mb-8 flex flex-wrap items-center gap-2 font-body text-sm text-[#817267]">
              <Link to="/" className="transition hover:text-primary">
                Home
              </Link>

              <span>/</span>

              <Link to="/shop" className="transition hover:text-primary">
                Shop
              </Link>

              <span>/</span>

              <span className="text-primary">{product.name}</span>
            </div>

            <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="relative"
              >
                <div className="absolute -left-10 -top-10 h-72 w-72 rounded-full bg-light/80 blur-[120px]" />

                <div className="relative">
                  <div className="group relative overflow-hidden rounded-[34px] bg-white shadow-2xl">
                    <button
                      type="button"
                      onClick={() => setIsImagePreviewOpen(true)}
                      className="block w-full cursor-zoom-in"
                      aria-label="Open full product image"
                    >
                      <img
                        src={activeImage || product.image}
                        alt={product.name}
                        className="h-[480px] w-full object-cover transition duration-700 group-hover:scale-110 sm:h-[620px] md:h-[720px]"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsImagePreviewOpen(true)}
                      className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg backdrop-blur transition hover:scale-105 hover:bg-white"
                      aria-label="Expand product image"
                    >
                      <FaExpand size={17} />
                    </button>

                    {product.bestseller && (
                      <span className="absolute left-5 top-5 rounded-full bg-primary px-5 py-2 font-body text-xs uppercase tracking-[0.2em] text-white shadow-lg">
                        Bestseller
                      </span>
                    )}

                    {galleryImages.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={showPreviousImage}
                          className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg backdrop-blur transition hover:bg-white"
                          aria-label="Previous image"
                        >
                          <FaChevronLeft size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={showNextImage}
                          className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg backdrop-blur transition hover:bg-white"
                          aria-label="Next image"
                        >
                          <FaChevronRight size={15} />
                        </button>
                      </>
                    )}
                  </div>

                  {galleryImages.length > 1 && (
                    <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
                      {galleryImages.map((image, index) => (
                        <button
                          type="button"
                          key={`${image}-${index}`}
                          onClick={() => setActiveImage(image)}
                          className={`shrink-0 overflow-hidden rounded-2xl border-2 transition ${
                            activeImage === image
                              ? "border-primary shadow-lg"
                              : "border-transparent opacity-75 hover:opacity-100"
                          }`}
                          aria-label={`View product image ${index + 1}`}
                        >
                          <img
                            src={image}
                            alt={`${product.name} view ${index + 1}`}
                            className="h-24 w-24 object-cover sm:h-28 sm:w-28"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="h-fit rounded-[40px] bg-white p-7 shadow-xl sm:p-10 lg:sticky lg:top-32"
              >
                <p className="font-body text-xs uppercase tracking-[0.35em] text-secondary">
                  {product.category} Collection
                </p>

                <h1 className="mt-5 font-heading text-5xl font-semibold leading-tight text-primary md:text-6xl">
                  {product.name}
                </h1>

                {product.sku && (
                  <p className="mt-3 font-body text-xs uppercase tracking-[0.2em] text-[#918277]">
                    SKU: {product.sku}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <p className="font-heading text-4xl font-semibold text-secondary">
                    {formatPrice(product.price)}
                  </p>

                  <span
                    className={`rounded-full px-4 py-2 font-body text-xs font-medium ${
                      isOutOfStock
                        ? "bg-red-100 text-red-700"
                        : isLowStock
                        ? "bg-amber-100 text-amber-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {isOutOfStock
                      ? "Out of Stock"
                      : isLowStock
                      ? `Only ${stock} Left`
                      : "In Stock"}
                  </span>
                </div>

               <div className="mt-5 flex flex-wrap items-center gap-3">
  <div
    className="flex text-xl"
    aria-label={`${averageRating.toFixed(
      1
    )} out of 5 stars`}
  >
    {renderRatingStars(averageRating)}
  </div>

  <span className="font-body text-sm text-[#817267]">
    {reviewCount > 0
      ? `${averageRating.toFixed(
          1
        )} (${reviewCount} ${
          reviewCount === 1
            ? "review"
            : "reviews"
        })`
      : "No reviews yet"}
  </span>
</div>

                <p className="mt-8 font-body text-base leading-8 text-[#6F6258]">
                  {product.description ||
                    "Carefully handcrafted using premium materials. Each piece is made with patience, creativity and attention to detail, making it perfect for everyday use and thoughtful gifting."}
                </p>

                <div className="mt-8 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-2xl bg-background p-4">
                    <p className="font-body text-sm font-semibold text-primary">
                      Handmade
                    </p>
                  </div>

                  <div className="rounded-2xl bg-background p-4">
                    <p className="font-body text-sm font-semibold text-primary">
                      Sustainable
                    </p>
                  </div>

                  <div className="rounded-2xl bg-background p-4">
                    <p className="font-body text-sm font-semibold text-primary">
                      Made With Love
                    </p>
                  </div>
                </div>

                <div className="mt-9">
                  <p className="font-body text-sm font-semibold text-primary">
                    Quantity
                  </p>

                  <div className="mt-3 flex w-fit items-center rounded-full border border-primary/15 bg-background p-1">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={isOutOfStock || quantity <= 1}
                      className="flex h-11 w-11 items-center justify-center rounded-full font-body text-xl text-primary transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      −
                    </button>

                    <span className="w-12 text-center font-body font-semibold text-primary">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={isOutOfStock || quantity >= stock}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-primary font-body text-xl text-white transition hover:bg-[#4E3829] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`mt-9 w-full rounded-full py-5 font-body text-base font-medium text-white shadow-lg transition duration-300 ${
                    isOutOfStock
                      ? "cursor-not-allowed bg-gray-400"
                      : added
                      ? "bg-secondary"
                      : "bg-primary hover:-translate-y-1 hover:bg-[#4E3829]"
                  }`}
                >
                  {isOutOfStock
                    ? "Out of Stock"
                    : added
                    ? "Added To Cart ✓"
                    : "Add To Cart"}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="mt-4 w-full rounded-full border border-primary py-5 text-center font-body text-base font-medium text-primary transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent"
                >
                  Buy Now
                </button>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={shareWhatsApp}
                    className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-4 font-body font-medium text-white transition duration-300 hover:-translate-y-1 hover:bg-[#1EBC5A]"
                  >
                    <FaWhatsapp size={19} />
                    Share on WhatsApp
                  </button>

                  <button
                    type="button"
                    onClick={copyLink}
                    className="flex items-center justify-center gap-2 rounded-full border border-primary py-4 font-body font-medium text-primary transition duration-300 hover:-translate-y-1 hover:bg-primary hover:text-white"
                  >
                    <FaLink size={16} />
                    Copy Product Link
                  </button>
                </div>

                <div className="mt-9 space-y-4 border-t border-primary/10 pt-7 font-body text-sm text-[#6F6258]">
                  <p>✓ Secure checkout</p>
                  <p>✓ Carefully packed handmade product</p>
                  <p>✓ Delivery available across India</p>
                </div>

                <section className="mt-14">
                  <div className="flex flex-wrap gap-3">
                    {[
                      ["description", "Description"],
                      ["specifications", "Specifications"],
                      ["shipping", "Shipping"],
                      ["care", "Care"],
                    ].map(([tabId, label]) => (
                      <button
                        key={tabId}
                        type="button"
                        onClick={() => setActiveTab(tabId)}
                        className={`rounded-full px-6 py-3 transition ${
                          activeTab === tabId
                            ? "bg-primary text-white"
                            : "bg-background text-primary"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-8 rounded-[30px] bg-background p-7 font-body leading-8 text-[#6F6258] sm:p-8">
                    {activeTab === "description" && (
                      <p>
                        {product.description ||
                          "Every Tashekari product is handcrafted with care, making every piece unique. Slight variations are a natural and beautiful part of handmade craftsmanship."}
                      </p>
                    )}

                    {activeTab === "specifications" && (
                      <div className="grid gap-3">
                        {product.material && (
                          <div className="flex items-start justify-between gap-5 border-b border-primary/10 pb-3">
                            <span className="font-semibold text-primary">
                              Material
                            </span>
                            <span className="text-right">{product.material}</span>
                          </div>
                        )}

                        {product.dimensions && (
                          <div className="flex items-start justify-between gap-5 border-b border-primary/10 pb-3">
                            <span className="font-semibold text-primary">
                              Dimensions
                            </span>
                            <span className="text-right">
                              {product.dimensions}
                            </span>
                          </div>
                        )}

                        {product.weight && (
                          <div className="flex items-start justify-between gap-5 border-b border-primary/10 pb-3">
                            <span className="font-semibold text-primary">
                              Weight
                            </span>
                            <span className="text-right">{product.weight}</span>
                          </div>
                        )}

                        {product.sku && (
                          <div className="flex items-start justify-between gap-5 border-b border-primary/10 pb-3">
                            <span className="font-semibold text-primary">
                              SKU
                            </span>
                            <span className="text-right">{product.sku}</span>
                          </div>
                        )}

                        <div className="flex items-start justify-between gap-5">
                          <span className="font-semibold text-primary">
                            Craft
                          </span>
                          <span className="text-right">100% Handmade</span>
                        </div>
                      </div>
                    )}

                    {activeTab === "shipping" && (
                      <ul className="space-y-2">
                        <li>• Dispatch within 24–48 hours</li>
                        <li>• Pan India delivery</li>
                        <li>• Secure and careful packaging</li>
                      </ul>
                    )}

                    {activeTab === "care" && (
                      <ul className="space-y-2">
                        <li>• Keep away from excess water and moisture</li>
                        <li>• Store in a clean and dry place</li>
                        <li>• Gently clean using a soft, dry cloth</li>
                      </ul>
                    )}
                  </div>
                </section>

                {tags.length > 0 && (
                  <div className="mt-8 border-t border-primary/10 pt-7">
                    <p className="font-body text-sm font-semibold text-primary">
                      Product Tags
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-cream px-4 py-2 font-body text-xs text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

       <section className="bg-white py-20">
  <div className="mx-auto max-w-6xl px-6 lg:px-10">
    <p className="text-center font-body text-xs uppercase tracking-[0.35em] text-secondary">
      Customer Reviews
    </p>

    <h2 className="mt-4 text-center font-heading text-5xl font-semibold text-primary">
      Loved by Customers
    </h2>

    {reviewCount > 0 && (
      <div className="mx-auto mt-8 flex w-fit flex-wrap items-center justify-center gap-4 rounded-full bg-background px-6 py-3">
        <div className="flex text-xl">
          {renderRatingStars(averageRating)}
        </div>

        <p className="font-body text-sm text-[#6F6258]">
          <span className="font-semibold text-primary">
            {averageRating.toFixed(1)}
          </span>{" "}
          from {reviewCount}{" "}
          {reviewCount === 1
            ? "review"
            : "reviews"}
        </p>
      </div>
    )}

    {loadingReviews ? (
      <div className="mt-14 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />

        <p className="mt-4 font-body text-[#817267]">
          Loading reviews...
        </p>
      </div>
    ) : reviews.length === 0 ? (
      <div className="mx-auto mt-14 max-w-2xl rounded-[30px] bg-background px-6 py-12 text-center shadow-sm">
        <h3 className="font-heading text-3xl font-semibold text-primary">
          No Reviews Yet
        </h3>

        <p className="mt-3 font-body leading-7 text-[#6F6258]">
          Be the first customer to review this
          handmade product after delivery.
        </p>
      </div>
    ) : (
      <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <article
            key={review.id}
            className="flex h-full flex-col rounded-[30px] bg-background p-8 shadow-lg"
          >
            <div
              className="flex text-2xl"
              aria-label={`${review.rating} out of 5 stars`}
            >
              {renderRatingStars(review.rating)}
            </div>

            <p className="mt-5 flex-1 font-body leading-8 text-[#6F6258]">
              “{review.review_text}”
            </p>

            <div className="mt-7 border-t border-primary/10 pt-5">
              <h4 className="font-body font-semibold text-primary">
                {review.customer_name ||
                  "Tashekari Customer"}
              </h4>

              <p className="mt-1 font-body text-xs text-[#817267]">
                Verified Purchase
              </p>

              <p className="mt-2 font-body text-xs text-[#918277]">
                {review.created_at
                  ? new Date(
                      review.created_at
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : ""}
              </p>
            </div>
          </article>
        ))}
      </div>
    )}
  </div>
</section>

        {recentProducts.length > 0 && (
          <section className="bg-background py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
              <div className="text-center">
                <p className="font-body text-xs uppercase tracking-[0.35em] text-secondary">
                  Continue Shopping
                </p>

                <h2 className="mt-5 font-heading text-5xl font-semibold text-primary">
                  Recently Viewed
                </h2>
              </div>

              <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {recentProducts.map((item) => (
                  <ProductCard
                    key={item.id}
                    id={item.id}
                    image={item.image}
                    name={item.name}
                    price={item.price}
                    category={item.category}
                    bestseller={item.bestseller}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {relatedProducts.length > 0 && (
          <section className="bg-white py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
              <div className="text-center">
                <p className="font-body text-xs uppercase tracking-[0.35em] text-secondary">
                  You May Also Love
                </p>

                <h2 className="mt-5 font-heading text-5xl font-semibold text-primary">
                  Related Products
                </h2>
              </div>

              <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {relatedProducts.map((item) => (
                  <ProductCard
                    key={item.id}
                    id={item.id}
                    image={item.image}
                    name={item.name}
                    price={item.price}
                    category={item.category}
                    bestseller={item.bestseller}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />

      {isImagePreviewOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Product image preview"
        >
          <button
            type="button"
            onClick={() => setIsImagePreviewOpen(false)}
            className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-xl transition hover:scale-105"
            aria-label="Close image preview"
          >
            <FaTimes size={18} />
          </button>

          {galleryImages.length > 1 && (
            <button
              type="button"
              onClick={showPreviousImage}
              className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-primary shadow-xl sm:left-8"
              aria-label="Previous preview image"
            >
              <FaChevronLeft size={17} />
            </button>
          )}

          <img
            src={activeImage || product.image}
            alt={product.name}
            className="max-h-[88vh] max-w-[90vw] rounded-2xl object-contain"
          />

          {galleryImages.length > 1 && (
            <button
              type="button"
              onClick={showNextImage}
              className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-primary shadow-xl sm:right-8"
              aria-label="Next preview image"
            >
              <FaChevronRight size={17} />
            </button>
          )}
        </div>
      )}
    </>
  );
}