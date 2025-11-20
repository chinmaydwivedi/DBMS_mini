import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ordersAPI } from "@/lib/api";
import { Link } from "react-router-dom";
import { Package, Truck, MapPin, Calendar } from "lucide-react";

const Orders = () => {
  const userId = 1;
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getByUserId(userId, filter || undefined);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "text-green-600";
      case "OutForDelivery":
        return "text-blue-600";
      case "InTransit":
        return "text-purple-600";
      case "Shipped":
        return "text-indigo-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <div className="mb-6">
          <div className="flex gap-2">
            <Button
              variant={filter === "" ? "default" : "outline"}
              onClick={() => setFilter("")}
            >
              All
            </Button>
            <Button
              variant={filter === "Pending" ? "default" : "outline"}
              onClick={() => setFilter("Pending")}
            >
              Pending
            </Button>
            <Button
              variant={filter === "Shipped" ? "default" : "outline"}
              onClick={() => setFilter("Shipped")}
            >
              Shipped
            </Button>
            <Button
              variant={filter === "Delivered" ? "default" : "outline"}
              onClick={() => setFilter("Delivered")}
            >
              Delivered
            </Button>
          </div>
        </div>
        {loading ? (
          <p className="text-gray-600">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 mb-4">No orders found</p>
            <Link to="/products">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.order_id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-semibold">Order #{order.order_number}</p>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.item_count} {order.item_count === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.order_status)}>
                    {order.order_status}
                  </Badge>
                </div>

                {/* Delivery Tracking */}
                {order.delivery_status && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Truck className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-900">Delivery Tracking</h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-medium ${getDeliveryStatusColor(order.delivery_status)}`}>
                          {order.delivery_status.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                      {order.tracking_number && (
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">Tracking:</span>
                          <span className="font-medium text-gray-800">{order.tracking_number}</span>
                        </div>
                      )}
                      {order.estimated_delivery_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">Estimated Delivery:</span>
                          <span className="font-medium text-gray-800">
                            {new Date(order.estimated_delivery_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-2 mb-4">
                  {order.items?.map((item: any) => (
                    <div key={item.order_item_id} className="flex items-center gap-4">
                      <img 
                        src={item.image} 
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-grow flex justify-between">
                        <span className="text-gray-700">{item.product_name} x {item.quantity}</span>
                        <span className="font-medium">₹{item.total_price.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                  <span className="font-bold">Total: ₹{order.total_amount.toLocaleString()}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Details</Button>
                    {order.order_status === 'Delivered' && (
                      <Link to="/returns">
                        <Button variant="outline" size="sm">Return Items</Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Orders;

