import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cartAPI, couponsAPI } from "@/lib/api";

const Cart = () => {
  const userId = 1;
  const navigate = useNavigate();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.get(userId);
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    try {
      await cartAPI.update(userId, { cart_item_id: itemId, quantity: newQuantity });
      fetchCart();
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await cartAPI.remove(userId, itemId);
      fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleApplyCoupon = async () => {
    try {
      const response = await couponsAPI.validate({
        coupon_code: couponCode,
        user_id: userId,
        subtotal: cart?.subtotal || 0,
      });
      setDiscount(response.data.discount);
      alert(`Coupon applied! Discount: ₹${response.data.discount}`);
    } catch (error: any) {
      alert(error.response?.data?.error || "Invalid coupon code");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p>Loading cart...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const subtotal = cart?.subtotal || 0;
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal - discount + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        {!cart || cart.items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Link to="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item: any) => (
                <div key={item.cart_item_id} className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4">
                  <img
                    src={item.image}
                    alt={item.product_name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product_name}</h3>
                    <p className="text-gray-600 text-sm">{item.brand}</p>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2 border border-gray-300 rounded">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.cart_item_id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{item.total.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">₹{item.price_at_addition.toLocaleString()} each</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 sticky top-20">
                <h2 className="text-xl font-bold">Order Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
                <div>
                  <Input
                    placeholder="Coupon code"
                    className="mb-2"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button variant="outline" className="w-full" onClick={handleApplyCoupon}>
                    Apply Coupon
                  </Button>
                </div>
                <Button 
                  className="w-full bg-primary text-white hover:bg-primary/90" 
                  size="lg"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;

