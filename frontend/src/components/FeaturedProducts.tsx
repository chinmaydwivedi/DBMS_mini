import { ProductCard } from "./ProductCard";
import { useEffect, useState } from "react";
import { productsAPI } from "@/lib/api";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export const FeaturedProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsAPI.getFeatured();
        setProducts(response.data || []);
      } catch (error) {
        console.error("Error fetching featured products:", error);
        setProducts([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl">
              Handpicked products just for you
            </p>
          </div>
          <Link to="/products">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.product_id}
              id={product.product_id}
              name={product.product_name}
              brand={product.brand || "Unknown"}
              price={Number(product.selling_price) || 0}
              originalPrice={Number(product.original_price) || 0}
              discount={Number(product.discount || product.discount_percentage) || 0}
              rating={Number(product.average_rating) || 0}
              reviews={Number(product.total_reviews) || 0}
              image={product.image || product.product_image || `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format`}
              inStock={product.inStock !== false && (product.stock_quantity > 0 || product.inStock === true)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

