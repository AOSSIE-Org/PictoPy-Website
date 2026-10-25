import Download from "@/components/Download";
import Hero from "@/components/Hero";
import MacMockup from "@/components/MockUp";

import MockUpWithDesc from "@/components/MockUpWithDesc";
import Features from "@/components/Features";
import Metrics from "@/components/Metrics";
import SocialMediaCTA from "@/components/SocialMediaCTA";
import MacMockDesc from "@/components/MacMockDesc";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Download />
      <div className="mx-auto w-full max-w-240">
        <MacMockup
          image="/brand/assets/hero.jpg"
          imageClassName="-mt-[2.4%] scale-x-[1.01]"
        />
      </div>
      <MacMockDesc />
      <MockUpWithDesc image="/brand/assets/1.jpg" />
      <Features />
      <Metrics />
      <SocialMediaCTA />
      <Faq />
      <Footer />
    </>
  );
}
