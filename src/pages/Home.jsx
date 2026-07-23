import PageTransition from "../components/common/PageTransition";
import Testimonials from "../components/home/Testimonials";
import VideoBanner from "../components/home/VideoBanner";
import InstagramGallery from "../components/home/InstagramGallery";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/home/Hero";
import Categories from "../components/home/Categories";
import FeaturedProducts from "../components/home/FeaturedProducts";
import WhyChooseUs from "../components/home/WhyChooseUs";
import About from "../components/home/About";
import BrandStory from "../components/home/BrandStory";
import Newsletter from "../components/home/Newsletter";

export default function Home() {
  return (
    <PageTransition>
      <Navbar />

      <Hero />

      {/* TEMPORARY AUTO DEPLOY TEST */}
      <div className="bg-yellow-100 border border-yellow-300 text-center py-3">
        <p className="text-sm font-semibold text-yellow-800">
          🚀 Deployment Test - 24 July 2026
        </p>
      </div>

      <BrandStory />
      <VideoBanner />
      <Testimonials />
      <Categories />
      <FeaturedProducts />
      <WhyChooseUs />
      <About />
      <Newsletter />
      <InstagramGallery />
      <Footer />
    </PageTransition>
  );
}