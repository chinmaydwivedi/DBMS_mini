import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, TrendingUp, Users, ShoppingCart, Truck, CheckCircle, Crown, Calendar } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<"orders" | "memberships">("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [memberships, setMemberships] = useState<any[]>([]);
  const [membershipStats, setMembershipStats] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [filter, setFilter] = useState("Pending");
  const [membershipFilter, setMembershipFilter] = useState("Active");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [filter, membershipFilter, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === "orders") {
        const [ordersRes, statsRes] = await Promise.all([
          axios.get(`/api/admin/orders${filter ? `?status=${filter}` : ''}`),
          axios.get('/api/admin/dashboard/stats')
        ]);
        setOrders(ordersRes.data);
        setStats(statsRes.data);
      } else {
        const [membershipsRes, statsRes, membershipStatsRes] = await Promise.all([
          axios.get(`/api/admin/memberships${membershipFilter ? `?status=${membershipFilter}` : ''}`),
          axios.get('/api/admin/dashboard/stats'),
          axios.get('/api/admin/memberships/stats')
        ]);
        setMemberships(membershipsRes.data);
        setStats(statsRes.data);
        setMembershipStats(membershipStatsRes.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOrder = async (orderId: number) => {
    try {
      const response = await axios.post(`/api/admin/orders/${orderId}/confirm`);
      toast.success(response.data.message);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to confirm order");
    }
  };

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      await axios.put(`/api/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update status");
    }
  };

  const handleUpdateDelivery = async (orderId: number) => {
    const trackingNumber = prompt("Enter tracking number:");
    if (!trackingNumber) return;

    const courierPartner = prompt("Enter courier partner:", "BlueDart");
    
    try {
      await axios.put(`/api/admin/orders/${orderId}/delivery`, {
        tracking_number: trackingNumber,
        courier_partner: courierPartner,
        delivery_status: 'InTransit'
      });
      toast.success("Delivery information updated");
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update delivery");
    }
  };

  const handleVerifyMembership = async (membershipId: number) => {
    try {
      await axios.post(`/api/admin/memberships/${membershipId}/verify`);
      toast.success("Membership verified successfully");
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to verify membership");
    }
  };

  const handleUpdateMembershipStatus = async (membershipId: number, newStatus: string) => {
    try {
      await axios.put(`/api/admin/memberships/${membershipId}/status`, { status: newStatus });
      toast.success(`Membership status updated to ${newStatus}`);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update status");
    }
  };

  const handleExtendMembership = async (membershipId: number) => {
    const days = prompt("Enter number of days to extend:");
    if (!days || isNaN(parseInt(days))) return;

    try {
      await axios.put(`/api/admin/memberships/${membershipId}/extend`, { days: parseInt(days) });
      toast.success(`Membership extended by ${days} days`);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to extend membership");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-700";
      case "Shipped": return "bg-blue-100 text-blue-700";
      case "Confirmed": return "bg-purple-100 text-purple-700";
      case "Processing": return "bg-indigo-100 text-indigo-700";
      case "Pending": return "bg-yellow-100 text-yellow-700";
      case "Cancelled": return "bg-red-100 text-red-700";
      case "Active": return "bg-green-100 text-green-700";
      case "Expired": return "bg-red-100 text-red-700";
      case "Suspended": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getMembershipBadgeColor = (planType: string) => {
    switch (planType) {
      case "Platinum": return "bg-purple-100 text-purple-700 border-purple-300";
      case "Gold": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Silver": return "bg-gray-100 text-gray-700 border-gray-300";
      default: return "bg-blue-100 text-blue-700 border-blue-300";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p>Loading dashboard...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <Button
            variant={activeTab === "orders" ? "default" : "outline"}
            onClick={() => setActiveTab("orders")}
            className="flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            Orders Management
          </Button>
          <Button
            variant={activeTab === "memberships" ? "default" : "outline"}
            onClick={() => setActiveTab("memberships")}
            className="flex items-center gap-2"
          >
            <Crown className="w-4 h-4" />
            Membership Management
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <Package className="w-8 h-8 text-yellow-600" />
                <span className="text-2xl font-bold">{stats.pending_orders}</span>
              </div>
              <p className="text-gray-600">Pending Orders</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <span className="text-2xl font-bold">{stats.confirmed_orders}</span>
              </div>
              <p className="text-gray-600">Confirmed Orders</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <Truck className="w-8 h-8 text-blue-600" />
                <span className="text-2xl font-bold">{stats.shipped_orders}</span>
              </div>
              <p className="text-gray-600">Shipped Orders</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <span className="text-2xl font-bold">₹{(stats.total_revenue / 1000).toFixed(0)}K</span>
              </div>
              <p className="text-gray-600">Total Revenue</p>
            </div>
            
            {activeTab === "memberships" && (
              <>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Crown className="w-8 h-8 text-green-600" />
                    <span className="text-2xl font-bold">{stats.active_memberships}</span>
                  </div>
                  <p className="text-gray-600">Active Memberships</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Calendar className="w-8 h-8 text-red-600" />
                    <span className="text-2xl font-bold">{stats.expired_memberships || 0}</span>
                  </div>
                  <p className="text-gray-600">Needs Renewal</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Orders Section */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Orders Management</h2>
            <div className="flex gap-2">
              {["Pending", "Confirmed", "Processing", "Shipped", "Delivered"].map((status) => (
                <Button
                  key={status}
                  variant={filter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(status)}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>

          {orders.length === 0 ? (
            <p className="text-center text-gray-600 py-8">No orders found</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.order_id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-lg font-semibold">Order #{order.order_number}</p>
                      <p className="text-sm text-gray-600">
                        {order.first_name} {order.last_name} • {order.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        Created: {new Date(order.created_at).toLocaleString()}
                      </p>
                      {order.tracking_number && (
                        <p className="text-sm text-blue-600 mt-1">
                          Tracking: {order.tracking_number}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(order.order_status)}>
                        {order.order_status}
                      </Badge>
                      <p className="text-lg font-bold mt-2">
                        ₹{parseFloat(order.total_amount).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">{order.payment_mode}</p>
                      <p className="text-sm text-gray-600">{order.item_count} items</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-wrap">
                    {order.order_status === 'Pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleConfirmOrder(order.order_id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Confirm Order
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(order.order_id, 'Cancelled')}
                          className="text-red-600 border-red-600"
                        >
                          Cancel
                        </Button>
                      </>
                    )}

                    {order.order_status === 'Confirmed' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(order.order_id, 'Processing')}
                          className="bg-indigo-600 hover:bg-indigo-700"
                        >
                          Start Processing
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateDelivery(order.order_id)}
                        >
                          Update Tracking
                        </Button>
                      </>
                    )}

                    {order.order_status === 'Processing' && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(order.order_id, 'Shipped')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Mark as Shipped
                      </Button>
                    )}

                    {order.order_status === 'Shipped' && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(order.order_id, 'Delivered')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Mark as Delivered
                      </Button>
                    )}

                    {order.order_status === 'Delivered' && (
                      <span className="text-green-600 font-medium">✓ Completed</span>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.location.href = `/orders`}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        )}

        {/* Memberships Section */}
        {activeTab === "memberships" && (
          <>
            {/* Membership Statistics */}
            {membershipStats.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Membership Plan Statistics</h2>
                <div className="grid md:grid-cols-4 gap-4">
                  {membershipStats.map((stat: any) => (
                    <div key={stat.plan_type} className="p-4 border rounded-lg">
                      <Badge className={getMembershipBadgeColor(stat.plan_type)}>
                        {stat.plan_name}
                      </Badge>
                      <div className="mt-3">
                        <p className="text-2xl font-bold">{stat.total_subscribers}</p>
                        <p className="text-sm text-gray-600">Total Subscribers</p>
                      </div>
                      <div className="mt-2">
                        <p className="text-lg font-semibold text-green-600">
                          ₹{parseFloat(stat.total_revenue).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">Revenue</p>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Active: {stat.active_subscribers}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Memberships Management */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">User Memberships</h2>
                <div className="flex gap-2">
                  {["Active", "Expired", "Cancelled", "Suspended"].map((status) => (
                    <Button
                      key={status}
                      variant={membershipFilter === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMembershipFilter(status)}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>

              {memberships.length === 0 ? (
                <p className="text-center text-gray-600 py-8">No memberships found</p>
              ) : (
                <div className="space-y-4">
                  {memberships.map((membership: any) => (
                    <div key={membership.membership_id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">
                              {membership.first_name} {membership.last_name}
                            </h3>
                            <Badge className={getMembershipBadgeColor(membership.plan_type)}>
                              {membership.plan_name}
                            </Badge>
                            <Badge className={getStatusColor(membership.membership_status)}>
                              {membership.membership_status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{membership.email}</p>
                          <p className="text-sm text-gray-600">{membership.phone_number}</p>
                          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <p className="text-gray-600">Start Date</p>
                              <p className="font-medium">
                                {new Date(membership.start_date).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">End Date</p>
                              <p className="font-medium">
                                {new Date(membership.end_date).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Days Remaining</p>
                              <p className={`font-medium ${
                                membership.days_remaining < 0 ? 'text-red-600' : 
                                membership.days_remaining < 7 ? 'text-yellow-600' : 
                                'text-green-600'
                              }`}>
                                {membership.days_remaining} days
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Billing Cycle</p>
                              <p className="font-medium">{membership.billing_cycle}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-lg font-bold">
                            ₹{parseFloat(
                              membership.billing_cycle === 'Monthly' 
                                ? membership.monthly_price 
                                : membership.annual_price
                            ).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {membership.billing_cycle === 'Monthly' ? '/month' : '/year'}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 flex-wrap">
                        {membership.membership_status === 'Active' && membership.days_remaining < 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateMembershipStatus(membership.membership_id, 'Expired')}
                            className="text-orange-600 border-orange-600"
                          >
                            Mark as Expired
                          </Button>
                        )}

                        {membership.membership_status === 'Active' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleExtendMembership(membership.membership_id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Calendar className="w-4 h-4 mr-2" />
                              Extend
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateMembershipStatus(membership.membership_id, 'Suspended')}
                              className="text-orange-600 border-orange-600"
                            >
                              Suspend
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateMembershipStatus(membership.membership_id, 'Cancelled')}
                              className="text-red-600 border-red-600"
                            >
                              Cancel
                            </Button>
                          </>
                        )}

                        {membership.membership_status === 'Suspended' && (
                          <Button
                            size="sm"
                            onClick={() => handleVerifyMembership(membership.membership_id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Reactivate
                          </Button>
                        )}

                        {membership.membership_status === 'Expired' && (
                          <Button
                            size="sm"
                            onClick={() => handleVerifyMembership(membership.membership_id)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Renew & Activate
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.location.href = `/profile`}
                        >
                          View User Profile
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;

