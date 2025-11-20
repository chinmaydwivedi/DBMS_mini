import { useState, useEffect } from "react";
import { ProductCard } from "./ProductCard";
import { LoadingSpinner } from "./LoadingSpinner";
import { TrendingUp } from "lucide-react";
import { productsAPI } from "@/lib/api";

export const TopSelling = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopSelling();
  }, []);

  const fetchTopSelling = async () => {
    try {
      const response = await productsAPI.getTopSelling(8);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching top selling products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="w-8 h-8 text-green-600" />
          <h2 className="text-3xl font-bold">Top Selling Products</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

