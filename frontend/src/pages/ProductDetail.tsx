import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingCart, Minus, Plus } from "lucide-react";
import { productsAPI, cartAPI, wishlistAPI, reviewsAPI } from "@/lib/api";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const userId = 1;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const [productRes, reviewsRes] = await Promise.all([
          productsAPI.getById(Number(id)),
          reviewsAPI.getByProductId(Number(id)),
        ]);
        setProduct(productRes.data);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await cartAPI.add(userId, { product_id: Number(id), quantity });
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  const handleWishlist = async () => {
    try {
      if (isWishlisted) {
        await wishlistAPI.remove(userId, Number(id));
        setIsWishlisted(false);
      } else {
        await wishlistAPI.add(userId, { product_id: Number(id) });
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p>Loading product...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p>Product not found</p>
          <Link to="/products">
            <Button className="mt-4">Back to Products</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 bg-white p-8 rounded-lg shadow-md">
          <div>
            <img
              src={product.primary_image || product.images?.[0] || `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop`}
              alt={product.product_name}
              className="w-full rounded-lg border border-gray-200"
            />
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-gray-500 mb-2">{product.brand}</p>
              <h1 className="text-3xl font-bold mb-4">{product.product_name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1 px-3 py-1 rounded bg-green-50 text-green-700">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-medium">{product.average_rating?.toFixed(1) || 0}</span>
                </div>
                <span className="text-gray-600">({product.total_reviews || 0} reviews)</span>
                {product.discount > 0 && (
                  <Badge className="bg-accent text-white">{product.discount}% OFF</Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold">₹{product.selling_price?.toLocaleString()}</span>
                {product.original_price > product.selling_price && (
                  <span className="text-xl text-gray-500 line-through">
                    ₹{product.original_price?.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {product.inStock ? "In Stock" : "Out of Stock"}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={!product.inStock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="flex-1 gap-2 bg-primary text-white hover:bg-primary/90"
                  disabled={!product.inStock}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleWishlist}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{product.description || "No description available."}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Seller</h3>
                <p className="text-gray-600">{product.seller_name || "ShopKart"}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Category</h3>
                <p className="text-gray-600">{product.category_name || "Uncategorized"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.review_id} className="border-b border-gray-200 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">{review.first_name} {review.last_name}</span>
                    {review.is_verified_purchase && (
                      <Badge variant="secondary" className="text-xs">Verified Purchase</Badge>
                    )}
                  </div>
                  <h4 className="font-semibold mb-1">{review.review_title}</h4>
                  <p className="text-gray-600">{review.review_text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;

