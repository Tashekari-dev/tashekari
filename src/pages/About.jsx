import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import AboutHero from "../components/about/AboutHero";
import StoryTimeline from "../components/about/StoryTimeline";
import ValuesSection from "../components/about/ValuesSection";

export default function About() {
  return (
    <>
      <Navbar />

      <main>
        <AboutHero />
        <StoryTimeline />
        <ValuesSection />
      </main>

      <Footer />
    </>
  );
}