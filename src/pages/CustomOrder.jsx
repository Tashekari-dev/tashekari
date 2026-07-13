import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import CustomHero from "../components/custom/CustomHero";
import WhyCustom from "../components/custom/WhyCustom";
import CustomForm from "../components/custom/CustomForm";
import CustomFAQ from "../components/custom/CustomFAQ";

export default function CustomOrder() {
  return (
    <>
      <Navbar />

      <main className="pt-28 bg-background">
        <CustomHero />
        <WhyCustom />
        <CustomForm />
        <CustomFAQ />
      </main>

      <Footer />
    </>
  );
}