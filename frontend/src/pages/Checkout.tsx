import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { cartAPI, addressesAPI, ordersAPI, couponsAPI } from "@/lib/api";
import { toast } from "sonner";
import { MapPin, CreditCard, Package, Plus } from "lucide-react";

const Checkout = () => {
  const userId = 1;
  const navigate = useNavigate();
  const [cart, setCart] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState<number | null>(null);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState<number | null>(null);
  const [paymentMode, setPaymentMode] = useState<string>("UPI");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    full_name: "",
    phone_number: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
    address_type: "Home"
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cartRes, addressesRes] = await Promise.all([
        cartAPI.get(userId),
        addressesAPI.getByUserId(userId)
      ]);
      setCart(cartRes.data);
      setAddresses(addressesRes.data);
      
      // Auto-select default address
      const defaultAddr = addressesRes.data.find((a: any) => a.is_default);
      if (defaultAddr) {
        setSelectedShippingAddress(defaultAddr.address_id);
        setSelectedBillingAddress(defaultAddr.address_id);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load checkout data");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    
    try {
      const response = await couponsAPI.validate({
        coupon_code: couponCode,
        user_id: userId,
        subtotal: cart?.subtotal || 0,
      });
      setDiscount(response.data.discount);
      toast.success(`Coupon applied! Discount: ₹${response.data.discount}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Invalid coupon code");
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.full_name || !newAddress.phone_number || !newAddress.address_line1 || 
        !newAddress.city || !newAddress.state || !newAddress.pincode) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await addressesAPI.create({
        user_id: userId,
        ...newAddress
      });
      toast.success("Address added successfully");
      setShowAddressForm(false);
      fetchData();
      setNewAddress({
        full_name: "",
        phone_number: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        pincode: "",
        address_type: "Home"
      });
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to add address");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedShippingAddress || !selectedBillingAddress) {
      toast.error("Please select shipping and billing addresses");
      return;
    }

    if (!cart || cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setPlacing(true);
      // Map payment method to database enum (Prepaid or COD)
      const dbPaymentMode = paymentMode === "CashOnDelivery" ? "COD" : "Prepaid";
      
      const response = await ordersAPI.create({
        user_id: userId,
        shipping_address_id: selectedShippingAddress,
        billing_address_id: selectedBillingAddress,
        payment_mode: dbPaymentMode,
        coupon_code: couponCode || null
      });

      toast.success("Order placed successfully!");
      navigate(`/orders`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p>Loading checkout...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-xl mb-4">Your cart is empty</p>
          <Button onClick={() => navigate("/products")}>Start Shopping</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const subtotal = cart?.subtotal || 0;
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = (subtotal - discount) * 0.18;
  const total = subtotal - discount + tax + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold">Shipping Address</h2>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowAddressForm(!showAddressForm)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New
                </Button>
              </div>

              {showAddressForm && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold mb-4">Add New Address</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Full Name *"
                      value={newAddress.full_name}
                      onChange={(e) => setNewAddress({...newAddress, full_name: e.target.value})}
                    />
                    <Input
                      placeholder="Phone Number *"
                      value={newAddress.phone_number}
                      onChange={(e) => setNewAddress({...newAddress, phone_number: e.target.value})}
                    />
                    <Input
                      className="md:col-span-2"
                      placeholder="Address Line 1 *"
                      value={newAddress.address_line1}
                      onChange={(e) => setNewAddress({...newAddress, address_line1: e.target.value})}
                    />
                    <Input
                      className="md:col-span-2"
                      placeholder="Address Line 2"
                      value={newAddress.address_line2}
                      onChange={(e) => setNewAddress({...newAddress, address_line2: e.target.value})}
                    />
                    <Input
                      placeholder="City *"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                    />
                    <Input
                      placeholder="State *"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                    />
                    <Input
                      placeholder="Pincode *"
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                    />
                    <select
                      className="border border-gray-300 rounded-md px-3 py-2"
                      value={newAddress.address_type}
                      onChange={(e) => setNewAddress({...newAddress, address_type: e.target.value})}
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleAddAddress}>Save Address</Button>
                    <Button variant="outline" onClick={() => setShowAddressForm(false)}>Cancel</Button>
                  </div>
                </div>
              )}

              {addresses.length === 0 ? (
                <p className="text-gray-600">No addresses found. Please add a new address.</p>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr.address_id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedShippingAddress === addr.address_id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => {
                        setSelectedShippingAddress(addr.address_id);
                        setSelectedBillingAddress(addr.address_id);
                      }}
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className="font-semibold">{addr.full_name}</p>
                          <p className="text-sm text-gray-600">{addr.phone_number}</p>
                          <p className="text-sm text-gray-700 mt-2">
                            {addr.address_line1}, {addr.address_line2 && `${addr.address_line2}, `}
                            {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                        </div>
                        {addr.is_default && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded h-fit">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold">Payment Method</h2>
              </div>
              <div className="space-y-3">
                {["UPI", "Card", "NetBanking", "CashOnDelivery"].map((method) => (
                  <div
                    key={method}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      paymentMode === method
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => setPaymentMode(method)}
                  >
                    <p className="font-medium">{method === "CashOnDelivery" ? "Cash on Delivery" : method}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                {cart.items.map((item: any) => (
                  <div key={item.cart_item_id} className="flex gap-3 text-sm">
                    <img src={item.image} alt={item.product_name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                      <p className="font-medium">₹{item.total.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax (18%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mb-4">
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
                className="w-full"
                size="lg"
                onClick={handlePlaceOrder}
                disabled={placing || !selectedShippingAddress}
              >
                {placing ? "Placing Order..." : "Place Order"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;

