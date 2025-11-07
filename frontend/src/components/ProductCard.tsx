import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { cartAPI, wishlistAPI } from "@/lib/api";

interface ProductCardProps {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  image: string;
  inStock: boolean;
}

export const ProductCard = ({
  id,
  name,
  brand,
  price,
  originalPrice,
  discount,
  rating,
  reviews,
  image,
  inStock,
}: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const userId = 1; // In real app, get from auth context

  const handleAddToCart = async () => {
    try {
      await cartAPI.add(userId, { product_id: id, quantity: 1 });
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  const handleWishlist = async () => {
    try {
      if (isWishlisted) {
        await wishlistAPI.remove(userId, id);
        setIsWishlisted(false);
      } else {
        await wishlistAPI.add(userId, { product_id: id });
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-200">
      <Link to={`/product/${id}`}>
        <div className="relative overflow-hidden aspect-square bg-gray-100">
          <img
            src={image}
            alt={name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          {discount > 0 && (
            <Badge className="absolute top-3 left-3 bg-accent text-white">
              {discount}% OFF
            </Badge>
          )}
          {!inStock && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 space-y-3">
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all z-10 shadow-md"
        >
          <Heart
            className={`h-4 w-4 transition-all ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>

        <div>
          <p className="text-sm text-gray-500">{brand}</p>
          <Link to={`/product/${id}`}>
            <h3 className="font-semibold line-clamp-2 text-gray-900 hover:text-primary transition-colors">{name}</h3>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-green-50 text-green-700 text-xs font-medium">
            <Star className="h-3 w-3 fill-current" />
            <span>{Number(rating || 0).toFixed(1)}</span>
          </div>
          <span className="text-xs text-gray-500">({reviews || 0})</span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">₹{Number(price || 0).toLocaleString()}</span>
          {Number(originalPrice || 0) > Number(price || 0) && (
            <span className="text-sm text-gray-500 line-through">
              ₹{Number(originalPrice || 0).toLocaleString()}
            </span>
          )}
        </div>

        <Button 
          className="w-full gap-2 bg-primary text-white hover:bg-primary/90" 
          disabled={!inStock}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

