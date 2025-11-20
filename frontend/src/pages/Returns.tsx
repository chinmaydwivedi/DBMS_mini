import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Package, RotateCcw, Check, X, Clock } from "lucide-react";
import { returnsAPI } from "@/lib/api";

const Returns = () => {
  const userId = 1;
  const [returns, setReturns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      const response = await returnsAPI.getByUserId(userId);
      setReturns(response.data);
    } catch (error) {
      console.error("Error fetching returns:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <Check className="w-5 h-5 text-green-600" />;
      case 'Rejected': return <X className="w-5 h-5 text-red-600" />;
      case 'Requested': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'Approved': return <Check className="w-5 h-5 text-blue-600" />;
      case 'PickupScheduled': return <Package className="w-5 h-5 text-purple-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Requested': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-blue-100 text-blue-800';
      case 'PickupScheduled': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p>Loading returns...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <RotateCcw className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold">My Returns</h1>
        </div>

        {returns.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <RotateCcw className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No returns yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't requested any returns
            </p>
            <Button onClick={() => window.location.href = '/orders'}>
              View Orders
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {returns.map((returnItem) => (
              <div key={returnItem.return_id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={returnItem.image}
                      alt={returnItem.product_name}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>

                  {/* Return Details */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">
                          {returnItem.product_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Return Number: {returnItem.return_number}
                        </p>
                        <p className="text-sm text-gray-600">
                          Order: {returnItem.order_number}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(returnItem.return_status)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(returnItem.return_status)}`}>
                          {returnItem.return_status}
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Reason</p>
                        <p className="font-medium">{returnItem.return_reason}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Refund Amount</p>
                        <p className="font-medium text-green-600">
                          ₹{parseFloat(returnItem.refund_amount).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Quantity</p>
                        <p className="font-medium">{returnItem.return_quantity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Requested On</p>
                        <p className="font-medium">
                          {new Date(returnItem.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {returnItem.return_description && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">Description</p>
                        <p className="text-sm bg-gray-50 p-3 rounded-md">
                          {returnItem.return_description}
                        </p>
                      </div>
                    )}

                    {returnItem.admin_notes && (
                      <div className="bg-blue-50 p-3 rounded-md">
                        <p className="text-sm font-medium text-blue-900 mb-1">Admin Notes</p>
                        <p className="text-sm text-blue-800">{returnItem.admin_notes}</p>
                      </div>
                    )}

                    {returnItem.return_status === 'PickupScheduled' && returnItem.pickup_date && (
                      <div className="mt-4 bg-purple-50 p-3 rounded-md">
                        <p className="text-sm font-medium text-purple-900">
                          Pickup scheduled for {new Date(returnItem.pickup_date).toLocaleDateString()}
                        </p>
                      </div>
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

export default Returns;

