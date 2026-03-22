import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { FeaturedAccommodations } from "@/components/featured-accommodations";
import { ModularAdvantage } from "@/components/modular-advantage";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturedAccommodations />
      <ModularAdvantage />
      <Footer />
    </main>
  );
}
