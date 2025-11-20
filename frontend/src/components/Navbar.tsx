import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Heart, User, Search, Menu, Package, RotateCcw, MessageSquare, Crown, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { cartAPI } from "@/lib/api";

export const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userId = 1; // In real app, get from auth context

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await cartAPI.get(userId);
        setCartCount(response.data?.item_count || 0);
      } catch (error) {
        // Silently fail - cart count is not critical for page load
        console.error("Error fetching cart:", error);
        setCartCount(0);
      }
    };
    fetchCart();
  }, [userId]);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-8">
            <button className="lg:hidden">
              <Menu className="h-6 w-6" />
            </button>
            <Link to="/">
              <h1 className="text-2xl font-bold text-primary">
                ShopKart
              </h1>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-2xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for products, brands and more..."
                className="pl-10 pr-4 w-full border-gray-300"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/membership">
              <Button variant="ghost" size="icon" className="relative">
                <Crown className="h-5 w-5 text-purple-600" />
              </Button>
            </Link>
            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent text-white">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <User className="h-5 w-5" />
              </Button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      My Profile
                    </div>
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      My Orders
                    </div>
                  </Link>
                  <Link to="/returns" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <div className="flex items-center gap-2">
                      <RotateCcw className="h-4 w-4" />
                      Returns
                    </div>
                  </Link>
                  <Link to="/reviews" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Write Reviews
                    </div>
                  </Link>
                  <Link to="/support" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Support
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              className="pl-10 pr-4 w-full"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

