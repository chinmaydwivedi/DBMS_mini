import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { FlashDeals } from "@/components/FlashDeals";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { TopSelling } from "@/components/TopSelling";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Categories />
      <FlashDeals />
      <FeaturedProducts />
      <TopSelling />
      <Footer />
    </div>
  );
};

export default Index;
