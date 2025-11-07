import { Button } from "@/components/ui/button";
import { ShoppingBag, TrendingUp, Star } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <TrendingUp className="h-4 w-4" />
              India's Largest Online Marketplace
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Shop Everything
              <span className="block text-primary">
                You Love
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-xl">
              Discover millions of products from trusted sellers. Get the best deals, 
              fastest delivery, and hassle-free returns on everything you need.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <Button size="lg" className="gap-2 bg-primary text-white hover:bg-primary/90">
                  <ShoppingBag className="h-5 w-5" />
                  Start Shopping
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Explore Deals
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-2xl font-bold">10M+</div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
              <div>
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-sm text-gray-600">Sellers</div>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-accent text-accent" />
                <div className="text-2xl font-bold">4.5</div>
                <div className="text-sm text-gray-600 ml-1">Rating</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 blur-3xl -z-10" />
            <img 
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=600&fit=crop" 
              alt="Shopping experience" 
              className="rounded-2xl shadow-2xl w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

