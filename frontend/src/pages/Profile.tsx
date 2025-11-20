import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { User, Award, Wallet, Mail, Phone, Calendar, CreditCard } from "lucide-react";
import { usersAPI } from "@/lib/api";
import { Link } from "react-router-dom";

const Profile = () => {
  const userId = 1;
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await usersAPI.getById(userId);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  const getLoyaltyTier = (points: number) => {
    if (points >= 10000) return { tier: 'Platinum', color: 'text-purple-600', bg: 'bg-purple-100' };
    if (points >= 5000) return { tier: 'Gold', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (points >= 1000) return { tier: 'Silver', color: 'text-gray-600', bg: 'bg-gray-100' };
    return { tier: 'Bronze', color: 'text-orange-600', bg: 'bg-orange-100' };
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p>Loading profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p>User not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const loyalty = getLoyaltyTier(user.loyalty_points || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-gray-600">Customer since {new Date(user.created_at).getFullYear()}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="w-5 h-5 text-gray-400" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="w-5 h-5 text-gray-400" />
                <span>{user.phone_number}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-4">Account Status</h3>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  user.account_status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.account_status}
                </span>
              </div>
            </div>
          </div>

          {/* Loyalty & Wallet */}
          <div className="space-y-6">
            {/* Loyalty Card */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-md p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Loyalty Tier</h3>
              </div>
              <div className={`inline-block px-4 py-2 rounded-full ${loyalty.bg} ${loyalty.color} font-bold text-lg mb-4`}>
                {loyalty.tier}
              </div>
              <div className="mt-4">
                <p className="text-sm opacity-90 mb-1">Loyalty Points</p>
                <p className="text-3xl font-bold">{user.loyalty_points?.toLocaleString() || 0}</p>
              </div>
            </div>

            {/* Wallet Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <Wallet className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold">Wallet Balance</h3>
              </div>
              <p className="text-3xl font-bold text-green-600">
                ₹{parseFloat(user.wallet_balance || 0).toFixed(2)}
              </p>
              <Button className="w-full mt-4" variant="outline">
                Add Money
              </Button>
            </div>

            {/* Membership Card */}
            {user.membership ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-semibold">Membership</h3>
                </div>
                <p className="text-lg font-bold text-purple-600 mb-2">
                  {user.membership.plan_name}
                </p>
                <p className="text-sm text-gray-600">
                  Valid until {new Date(user.membership.end_date).toLocaleDateString()}
                </p>
                <Link to="/membership">
                  <Button className="w-full mt-4" variant="outline">
                    Manage Plan
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-semibold">Membership</h3>
                </div>
                <p className="text-gray-600 mb-4">No active membership</p>
                <Link to="/membership">
                  <Button className="w-full" variant="default">
                    Explore Plans
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/orders">
            <Button className="w-full" variant="outline">
              My Orders
            </Button>
          </Link>
          <Link to="/wishlist">
            <Button className="w-full" variant="outline">
              Wishlist
            </Button>
          </Link>
          <Link to="/returns">
            <Button className="w-full" variant="outline">
              Returns
            </Button>
          </Link>
          <Link to="/support">
            <Button className="w-full" variant="outline">
              Support
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;

