import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, Crown, Star, Zap } from "lucide-react";
import { membershipAPI } from "@/lib/api";
import { toast } from "sonner";

const Membership = () => {
  const userId = 1;
  const [plans, setPlans] = useState<any[]>([]);
  const [currentMembership, setCurrentMembership] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Yearly'>('Yearly');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [plansRes, membershipRes] = await Promise.all([
        membershipAPI.getPlans(),
        membershipAPI.getUserMembership(userId),
      ]);
      setPlans(plansRes.data);
      if (membershipRes.data && !membershipRes.data.message) {
        setCurrentMembership(membershipRes.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: number) => {
    try {
      setSelectedPlan(planId);
      const response = await membershipAPI.subscribe({
        user_id: userId,
        plan_id: planId,
        billing_cycle: billingCycle,
      });
      toast.success(response.data.message);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to subscribe");
    } finally {
      setSelectedPlan(null);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your membership?")) return;
    
    try {
      await membershipAPI.cancel(userId);
      toast.success("Membership cancelled successfully");
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to cancel membership");
    }
  };

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case 'Free': return Star;
      case 'Silver': return Zap;
      case 'Gold': return Star;
      case 'Platinum': return Crown;
      default: return Star;
    }
  };

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'Free': return 'border-gray-300';
      case 'Silver': return 'border-gray-400';
      case 'Gold': return 'border-yellow-400';
      case 'Platinum': return 'border-purple-500';
      default: return 'border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p>Loading membership plans...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Membership Plans</h1>
          <p className="text-gray-600 text-lg">Choose the perfect plan for your shopping needs</p>
          
          {currentMembership && (
            <div className="mt-6 inline-block bg-green-100 text-green-800 px-6 py-3 rounded-full">
              Current Plan: <span className="font-bold">{currentMembership.plan_name}</span>
            </div>
          )}
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md inline-flex">
            <button
              className={`px-6 py-2 rounded-md transition-colors ${
                billingCycle === 'Monthly' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              onClick={() => setBillingCycle('Monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-6 py-2 rounded-md transition-colors ${
                billingCycle === 'Yearly' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              onClick={() => setBillingCycle('Yearly')}
            >
              Yearly <span className="text-sm">(Save 20%)</span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {plans.map((plan) => {
            const Icon = getPlanIcon(plan.plan_type);
            const isCurrentPlan = currentMembership?.plan_id === plan.plan_id;
            const price = billingCycle === 'Monthly' ? plan.monthly_price : plan.annual_price;
            const savingsText = billingCycle === 'Yearly' && plan.monthly_price > 0 
              ? `Save ₹${((plan.monthly_price * 12) - plan.annual_price).toFixed(0)}/year`
              : '';

            return (
              <div
                key={plan.plan_id}
                className={`bg-white rounded-lg shadow-lg p-6 border-2 ${getPlanColor(plan.plan_type)} ${
                  isCurrentPlan ? 'ring-2 ring-green-500' : ''
                }`}
              >
                <div className="text-center mb-6">
                  <Icon className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                  <h3 className="text-2xl font-bold mb-2">{plan.plan_name}</h3>
                  <div className="text-3xl font-bold mb-1">
                    ₹{parseFloat(price).toFixed(0)}
                    <span className="text-sm text-gray-600 font-normal">
                      /{billingCycle === 'Monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  {savingsText && (
                    <p className="text-sm text-green-600 font-semibold">{savingsText}</p>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  {plan.discount_percentage > 0 && (
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{plan.discount_percentage}% discount on all orders</span>
                    </div>
                  )}
                  {plan.free_delivery && (
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Free delivery on all orders</span>
                    </div>
                  )}
                  {plan.priority_support && (
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">24/7 Priority support</span>
                    </div>
                  )}
                  {plan.early_sale_access && (
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Early access to sales</span>
                    </div>
                  )}
                  {plan.cashback_percentage > 0 && (
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{plan.cashback_percentage}% cashback</span>
                    </div>
                  )}
                  {plan.warranty_extension_months > 0 && (
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{plan.warranty_extension_months} months warranty extension</span>
                    </div>
                  )}
                </div>

                {isCurrentPlan ? (
                  <Button className="w-full" variant="outline" disabled>
                    Current Plan
                  </Button>
                ) : plan.plan_type === 'Free' ? (
                  <Button className="w-full" variant="outline" disabled>
                    Default Plan
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handleSubscribe(plan.plan_id)}
                    disabled={selectedPlan !== null}
                  >
                    {selectedPlan === plan.plan_id ? 'Processing...' : 'Subscribe Now'}
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {currentMembership && currentMembership.plan_type !== 'Free' && (
          <div className="text-center">
            <Button variant="outline" onClick={handleCancel} className="text-red-600 border-red-600 hover:bg-red-50">
              Cancel Current Membership
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Membership;

