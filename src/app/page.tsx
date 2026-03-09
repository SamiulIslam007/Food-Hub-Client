import HeroSection from "@/components/modules/home/HeroSection";
import StatsBar from "@/components/modules/home/StatsBar";
import CategoriesSection from "@/components/modules/home/CategoriesSection";
import FeaturedMeals from "@/components/modules/home/FeaturedMeals";
import HowItWorks from "@/components/modules/home/HowItWorks";
import FeaturedProviders from "@/components/modules/home/FeaturedProviders";
import CtaBanner from "@/components/modules/home/CtaBanner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <CategoriesSection />
      <FeaturedMeals />
      <HowItWorks />
      <FeaturedProviders />
      <CtaBanner />
    </>
  );
}
