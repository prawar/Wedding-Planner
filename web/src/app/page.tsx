import { HomeMotion } from "@/components/home/home-motion";
import { ClosingBand, DesignsStrip, Hero, HowItWorks, OneFormTwoInvites, Pricing } from "@/components/home/sections";
import { Footer } from "@/components/site/footer";

export default function HomePage() {
  return (
    <HomeMotion>
      <main>
        <Hero />
        <OneFormTwoInvites />
        <HowItWorks />
        <DesignsStrip />
        <Pricing />
        <ClosingBand />
      </main>
      <Footer />
    </HomeMotion>
  );
}
