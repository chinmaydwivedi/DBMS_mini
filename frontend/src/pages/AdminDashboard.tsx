import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, TrendingUp, Users, ShoppingCart, Truck, CheckCircle, Crown, Calendar, Star, ThumbsUp } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<"orders" | "memberships" | "reviews">("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [memberships, setMemberships] = useState<any[]>([]);
  const [membershipStats, setMembershipStats] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [pendingReviewsCount, setPendingReviewsCount] = useState(0);
  const [stats, setStats] = useState<any>(null);
  const [filter, setFilter] = useState("Pending");
  const [membershipFilter, setMembershipFilter] = useState("Active");
  const [reviewFilter, setReviewFilter] = useState("Pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [filter, membershipFilter, reviewFilter, activeTab]);

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
      } else if (activeTab === "memberships") {
        const [membershipsRes, statsRes, membershipStatsRes] = await Promise.all([
          axios.get(`/api/admin/memberships${membershipFilter ? `?status=${membershipFilter}` : ''}`),
          axios.get('/api/admin/dashboard/stats'),
          axios.get('/api/admin/memberships/stats')
        ]);
        setMemberships(membershipsRes.data);
        setStats(statsRes.data);
        setMembershipStats(membershipStatsRes.data);
      } else if (activeTab === "reviews") {
        const [reviewsRes, statsRes, countRes] = await Promise.all([
          axios.get(`/api/admin/reviews?status=${reviewFilter}`),
          axios.get('/api/admin/dashboard/stats'),
          axios.get('/api/admin/reviews/pending/count')
        ]);
        setReviews(reviewsRes.data);
        setStats(statsRes.data);
        setPendingReviewsCount(countRes.data.pending_count);
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

  const handleApproveReview = async (reviewId: number) => {
    try {
      await axios.put(`/api/admin/reviews/${reviewId}/approve`);
      toast.success("Review approved successfully");
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to approve review");
    }
  };

  const handleRejectReview = async (reviewId: number) => {
    const reason = prompt("Enter reason for rejection (optional):");
    try {
      await axios.put(`/api/admin/reviews/${reviewId}/reject`, { reason });
      toast.success("Review rejected");
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to reject review");
    }
  };

  const handleFlagReview = async (reviewId: number) => {
    const reason = prompt("Enter reason for flagging:");
    if (!reason) return;
    try {
      await axios.put(`/api/admin/reviews/${reviewId}/flag`, { reason });
      toast.success("Review flagged for moderation");
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to flag review");
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm("Are you sure you want to delete this review? This action cannot be undone.")) return;
    try {
      await axios.delete(`/api/admin/reviews/${reviewId}`);
      toast.success("Review deleted");
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to delete review");
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
          <Button
            variant={activeTab === "reviews" ? "default" : "outline"}
            onClick={() => setActiveTab("reviews")}
            className="flex items-center gap-2"
          >
            <Star className="w-4 h-4" />
            Reviews Management
            {pendingReviewsCount > 0 && (
              <Badge className="ml-2 bg-red-500">{pendingReviewsCount}</Badge>
            )}
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

        {/* Reviews Section */}
        {activeTab === "reviews" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Reviews Management</h2>
              <div className="flex gap-2">
                {["Pending", "Approved", "Rejected", "Flagged"].map((status) => (
                  <Button
                    key={status}
                    variant={reviewFilter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setReviewFilter(status)}
                  >
                    {status}
                    {status === "Pending" && pendingReviewsCount > 0 && (
                      <Badge className="ml-2 bg-red-500 text-white">{pendingReviewsCount}</Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {reviews.length === 0 ? (
              <p className="text-center text-gray-600 py-8">No reviews found</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.review_id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">
                            {review.first_name} {review.last_name}
                          </h3>
                          <Badge className={getStatusColor(review.review_status)}>
                            {review.review_status}
                          </Badge>
                          {review.is_verified_purchase === 1 && (
                            <Badge className="bg-green-100 text-green-700">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{review.email}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Product: <span className="font-medium">{review.product_name}</span> by {review.brand}
                        </p>
                        
                        {/* Star Rating */}
                        <div className="flex items-center gap-1 my-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-gray-200 text-gray-200"
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-lg font-bold">{review.rating}/5</span>
                        </div>

                        {/* Review Content */}
                        {review.review_title && (
                          <h4 className="font-semibold mt-3 mb-1">{review.review_title}</h4>
                        )}
                        {review.review_text && (
                          <p className="text-gray-700">{review.review_text}</p>
                        )}

                        {/* Engagement Metrics */}
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            {review.helpful_count} helpful
                          </span>
                          <span>{review.unhelpful_count} not helpful</span>
                          <span className="text-xs">
                            Posted: {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-wrap mt-4 pt-4 border-t">
                      {review.review_status === 'Pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApproveReview(review.review_id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectReview(review.review_id)}
                            className="text-red-600 border-red-600"
                          >
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleFlagReview(review.review_id)}
                            className="text-orange-600 border-orange-600"
                          >
                            Flag as Inappropriate
                          </Button>
                        </>
                      )}

                      {review.review_status === 'Approved' && (
                        <>
                          <span className="text-green-600 font-medium flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Approved & Published
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleFlagReview(review.review_id)}
                            className="text-orange-600 border-orange-600"
                          >
                            Flag
                          </Button>
                        </>
                      )}

                      {review.review_status === 'Rejected' && (
                        <>
                          <span className="text-red-600 font-medium">Rejected</span>
                          <Button
                            size="sm"
                            onClick={() => handleApproveReview(review.review_id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Approve Anyway
                          </Button>
                        </>
                      )}

                      {review.review_status === 'Flagged' && (
                        <>
                          <span className="text-orange-600 font-medium">Flagged for Moderation</span>
                          <Button
                            size="sm"
                            onClick={() => handleApproveReview(review.review_id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectReview(review.review_id)}
                            className="text-red-600 border-red-600"
                          >
                            Reject
                          </Button>
                        </>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteReview(review.review_id)}
                        className="text-red-600 border-red-600 ml-auto"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;

