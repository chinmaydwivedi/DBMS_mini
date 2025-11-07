import { Clock, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { flashDealsAPI } from "@/lib/api";
import { ProductCard } from "./ProductCard";

export const FlashDeals = () => {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await flashDealsAPI.getAll();
        if (response.data && response.data.length > 0) {
          setDeals(response.data);
          const firstDeal = response.data[0];
          if (firstDeal.end_time) {
            calculateTimeLeft(new Date(firstDeal.end_time));
          }
        }
      } catch (error) {
        console.error("Error fetching flash deals:", error);
        setDeals([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const calculateTimeLeft = (endTime: Date) => {
    const now = new Date();
    const difference = endTime.getTime() - now.getTime();

    if (difference > 0) {
      setTimeLeft({
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    }
  };

  useEffect(() => {
    if (deals.length > 0 && deals[0].end_time) {
      const timer = setInterval(() => {
        calculateTimeLeft(new Date(deals[0].end_time));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [deals]);

  if (loading) {
    return null;
  }

  if (deals.length === 0) {
    return null;
  }

  const activeDeal = deals[0];

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-orange-100">
              <Zap className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">{activeDeal.deal_name || "Flash Deals"}</h2>
              <p className="text-gray-600">Limited time offers - Don't miss out!</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 px-6 py-3 rounded-lg bg-white border border-orange-200 shadow-md">
            <Clock className="h-5 w-5 text-orange-600" />
            <div className="flex items-center gap-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-xs text-gray-600">Hours</div>
              </div>
              <span className="text-2xl text-gray-400">:</span>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-xs text-gray-600">Minutes</div>
              </div>
              <span className="text-2xl text-gray-400">:</span>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="text-xs text-gray-600">Seconds</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {activeDeal.products?.slice(0, 4).map((product: any) => (
            <div key={product.product_id} className="relative">
              <ProductCard
                id={product.product_id}
                name={product.name}
                brand={product.brand}
                price={product.price}
                originalPrice={product.originalPrice}
                discount={product.discount}
                rating={product.rating || 0}
                reviews={product.reviews || 0}
                image={product.image}
                inStock={true}
              />
              {product.sold !== undefined && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Sold: {product.sold}/{product.total}</span>
                    <span>{Math.round((product.sold / product.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all"
                      style={{ width: `${(product.sold / product.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

