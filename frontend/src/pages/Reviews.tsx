import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Package, Plus, Edit } from "lucide-react";
import { ordersAPI, reviewsAPI } from "@/lib/api";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Reviews = () => {
  const userId = 1;
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    review_title: '',
    review_text: '',
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getByUserId(userId, 'Delivered');
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReviewForm = (order: any, item: any) => {
    setSelectedProduct({
      product_id: item.product_id,
      product_name: item.product_name,
      order_id: order.order_id,
    });
    setShowReviewForm(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reviewData.review_title || !reviewData.review_text) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await reviewsAPI.create({
        product_id: selectedProduct.product_id,
        user_id: userId,
        order_id: selectedProduct.order_id,
        rating: reviewData.rating,
        review_title: reviewData.review_title,
        review_text: reviewData.review_text,
      });
      toast.success("Review submitted successfully! It will be visible after admin approval.");
      setShowReviewForm(false);
      setReviewData({
        rating: 5,
        review_title: '',
        review_text: '',
      });
      setSelectedProduct(null);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to submit review");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p>Loading your orders...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Write Reviews</h1>

        {showReviewForm ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">
              Review: {selectedProduct?.product_name}
            </h2>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= reviewData.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-lg font-semibold">{reviewData.rating}/5</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Review Title</label>
                <Input
                  placeholder="Summarize your experience"
                  value={reviewData.review_title}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, review_title: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Review</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={5}
                  placeholder="Share your experience with this product"
                  value={reviewData.review_text}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, review_text: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  Submit Review
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowReviewForm(false);
                    setSelectedProduct(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {orders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">No delivered orders to review</p>
                <Link to="/products">
                  <Button>Shop Now</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-800">
                    <strong>Note:</strong> You can write reviews for products from your delivered orders. 
                    Reviews help other customers make informed decisions!
                  </p>
                </div>

                {orders.map((order) => (
                  <div key={order.order_id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">Order #{order.order_number}</h3>
                        <p className="text-sm text-gray-600">
                          Delivered on {new Date(order.delivered_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {order.items?.map((item: any) => (
                        <div
                          key={item.order_item_id}
                          className="flex items-center justify-between border-t border-gray-200 pt-4"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                              <Package className="h-8 w-8 text-gray-400" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{item.product_name}</h4>
                              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleOpenReviewForm(order, item)}
                            className="gap-2"
                          >
                            <Edit className="h-4 w-4" />
                            Write Review
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Reviews;
