import { Smartphone, Laptop, Shirt, Home, Book, Watch, Headphones, Camera, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { categoriesAPI } from "@/lib/api";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "./LoadingSpinner";

const iconMap: Record<string, any> = {
  Smartphone,
  Laptop,
  Shirt,
  Home,
  Book,
  Watch,
  Headphones,
  Camera,
  Package,
};

export const Categories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.getAll();
        setCategories(response.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
            <LoadingSpinner />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse through our wide range of categories to find exactly what you're looking for
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => {
            const Icon = iconMap[category.icon] || Package;
            return (
              <Link
                key={category.category_id}
                to={`/products?category=${category.category_id}`}
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white hover:shadow-lg transition-all border border-gray-200 group"
              >
                <div className={`p-4 rounded-full bg-gradient-to-br ${category.color} text-white group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-center text-gray-700">{category.category_name}</span>
                <span className="text-xs text-gray-500">{category.product_count} products</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

