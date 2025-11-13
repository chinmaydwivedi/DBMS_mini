import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingCart, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { cartAPI, wishlistAPI } from "@/lib/api";
import { toast } from "sonner";

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

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/400x400.png?text=No+Image";

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
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isUpdatingWishlist, setIsUpdatingWishlist] = useState(false);
  const userId = 1; // In real app, get from auth context

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await cartAPI.add(userId, { product_id: id, quantity: 1 });
      toast.success("Product added to cart!");
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlist = async () => {
    setIsUpdatingWishlist(true);
    try {
      if (isWishlisted) {
        await wishlistAPI.remove(userId, id);
        setIsWishlisted(false);
        toast.info("Removed from wishlist");
      } else {
        await wishlistAPI.add(userId, { product_id: id });
        setIsWishlisted(true);
        toast.success("Added to wishlist!");
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error("Failed to update wishlist");
    } finally {
      setIsUpdatingWishlist(false);
    }
  };

  const imageUrl = image || PLACEHOLDER_IMAGE;

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-200">
      <Link to={`/product/${id}`}>
        <div className="relative overflow-hidden aspect-square bg-gray-100">
          <img
            src={imageUrl}
            alt={name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = PLACEHOLDER_IMAGE;
            }}
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
          disabled={isUpdatingWishlist}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all z-10 shadow-md disabled:opacity-50 disabled:pointer-events-none"
        >
          {isUpdatingWishlist ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Heart
              className={`h-4 w-4 transition-all ${
                isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
            />
          )}
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
          disabled={!inStock || isAddingToCart}
          onClick={handleAddToCart}
        >
          {isAddingToCart ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ShoppingCart className="h-4 w-4" />
          )}
          {isAddingToCart ? "Adding..." : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
};