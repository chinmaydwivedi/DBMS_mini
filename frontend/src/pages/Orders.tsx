import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ordersAPI } from "@/lib/api";
import { Link } from "react-router-dom";

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
                  </div>
                  <Badge className={getStatusColor(order.order_status)}>
                    {order.order_status}
                  </Badge>
                </div>
                <div className="space-y-2 mb-4">
                  {order.items?.map((item: any) => (
                    <div key={item.order_item_id} className="flex justify-between">
                      <span>{item.product_name} x {item.quantity}</span>
                      <span>₹{item.total_price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                  <span className="font-bold">Total: ₹{order.total_amount.toLocaleString()}</span>
                  <Button variant="outline">View Details</Button>
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

