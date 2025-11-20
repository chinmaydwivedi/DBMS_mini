import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Store, Package, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { sellersAPI } from "@/lib/api";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const SellerDashboard = () => {
  const sellerId = 1; // In real app, get from auth
  const [seller, setSeller] = useState<any>(null);
  const [commission, setCommission] = useState<any>(null);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sellerRes, commissionRes, productsRes] = await Promise.all([
        sellersAPI.getById(sellerId),
        sellersAPI.getCommission(sellerId, dateRange.start_date, dateRange.end_date),
        sellersAPI.getTopProducts(sellerId, 5)
      ]);
      setSeller(sellerRes.data);
      setCommission(commissionRes.data);
      setTopProducts(productsRes.data);
    } catch (error) {
      console.error("Error fetching seller data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p>Seller not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Store className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{seller.business_name}</h1>
              <p className="text-gray-600">{seller.business_email}</p>
              <div className="flex items-center gap-4 mt-2">
                <Badge className={seller.account_status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                  {seller.account_status}
                </Badge>
                {seller.verified_seller && (
                  <Badge className="bg-blue-100 text-blue-700">Verified Seller</Badge>
                )}
                <span className="text-sm text-gray-600">
                  Rating: {seller.seller_rating?.toFixed(1) || 'N/A'} ⭐
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-6 h-6 text-purple-600" />
              <h3 className="text-gray-600 font-medium">Products</h3>
            </div>
            <p className="text-3xl font-bold">{seller.product_count || 0}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h3 className="text-gray-600 font-medium">Total Sales</h3>
            </div>
            <p className="text-3xl font-bold">{seller.total_sales || 0}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-6 h-6 text-blue-600" />
              <h3 className="text-gray-600 font-medium">Commission Rate</h3>
            </div>
            <p className="text-3xl font-bold">{seller.commission_rate}%</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <Store className="w-6 h-6 text-orange-600" />
              <h3 className="text-gray-600 font-medium">Rating</h3>
            </div>
            <p className="text-3xl font-bold">{seller.seller_rating?.toFixed(1) || 'N/A'}</p>
          </div>
        </div>

        {/* Commission Calculator */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold">Commission Calculator</h2>
          </div>

          {/* Date Range Selector */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.start_date}
                onChange={(e) => setDateRange({ ...dateRange, start_date: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.end_date}
                onChange={(e) => setDateRange({ ...dateRange, end_date: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={fetchData}>
                <Calendar className="w-4 h-4 mr-2" />
                Update
              </Button>
            </div>
          </div>

          {/* Commission Details */}
          {commission && (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Sales</p>
                <p className="text-2xl font-bold text-blue-600">
                  ₹{parseFloat(commission.total_sales || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Commission Amount</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{parseFloat(commission.commission_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Commission Rate</p>
                <p className="text-2xl font-bold text-purple-600">{commission.commission_rate}%</p>
              </div>
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold">Top Selling Products</h2>
            </div>
          </div>

          {topProducts.length === 0 ? (
            <p className="text-center text-gray-600 py-8">No products found</p>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product) => (
                <div key={product.product_id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <img 
                    src={product.image_url || `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format`}
                    alt={product.product_name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg">{product.product_name}</h3>
                    <p className="text-sm text-gray-600">{product.brand}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm">
                        <span className="font-medium">{product.total_sales}</span> sales
                      </span>
                      <span className="text-sm">
                        <span className="font-medium">{product.average_rating?.toFixed(1) || 'N/A'}</span> ⭐
                      </span>
                      <span className="text-sm">
                        Stock: <span className="font-medium">{product.stock_quantity}</span>
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">₹{parseFloat(product.selling_price).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bank Details */}
        {seller.account_holder_name && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-2xl font-bold mb-4">Bank Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Account Holder</p>
                <p className="font-medium">{seller.account_holder_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Account Number</p>
                <p className="font-medium">****{seller.account_number?.slice(-4)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bank Name</p>
                <p className="font-medium">{seller.bank_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">IFSC Code</p>
                <p className="font-medium">{seller.ifsc_code}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SellerDashboard;

