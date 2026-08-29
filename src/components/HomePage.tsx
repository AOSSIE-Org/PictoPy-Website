import Download from "@/components/Download";
import Hero from "@/components/Hero";
import MacMockup from "@/components/MockUp";

import image from "@/assets/PictoPy_Logo.png";
import MockUpWithDesc from "@/components/MockUpWithDesc";
import Metrics from "@/components/Metrics";
import SocialMediaCTA from "@/components/SocialMediaCTA";
import MacMockDesc from "@/components/MacMockDesc";
import FAQ from "./FAQ";
import CTA from "./CTA";
import PictoPyText from "./PictpPyText";
import Footer from "./ui/Footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Download />
      <MacMockup image={image} />
      <MacMockDesc />
      <MockUpWithDesc image={image} />
      <Metrics />
      <SocialMediaCTA />
      <FAQ />
      <CTA />
      <PictoPyText />
      <Footer />
    </>
  );
}
