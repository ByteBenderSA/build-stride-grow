import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Crown, 
  Rocket, 
  TrendingUp, 
  ArrowRight,
  Clock,
  Lightbulb,
  MessageSquare,
  X,
  CheckCircle,
  Star
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  getUserSubscription, 
  getUserUsageStats,
  SubscriptionPlan,
  SubscriptionStatus,
  UsageStats,
  PLAN_LIMITS
} from "@/lib/subscriptions";
import { YocoPayment } from "./YocoPayment";

interface UsageDisplayProps {
  compact?: boolean;
  showUpgradeButton?: boolean;
}

// Standalone Modal Component
const UpgradeModal = ({ isOpen, onClose, currentPlan, onUpgradeSuccess }: { 
  isOpen: boolean; 
  onClose: () => void; 
  currentPlan: string;
  onUpgradeSuccess?: () => void;
}) => {
  const [paymentSuccess, setPaymentSuccess] = useState<string>('');
  const [paymentError, setPaymentError] = useState<string>('');
  const [isPaymentProcessing, setIsPaymentProcessing] = useState<boolean>(false);

  // Hide modal when payment is processing or when not open
  if (!isOpen || isPaymentProcessing) return null;

  const handlePaymentSuccess = (paymentData: any) => {
    console.log('✅ Payment successful:', paymentData);
    setIsPaymentProcessing(false); // Allow modal to show again
    setPaymentSuccess(`Successfully upgraded to ${paymentData.planType.toUpperCase()} plan! 🎉`);
    setPaymentError('');
    
    // Call parent success handler to refresh usage data
    if (onUpgradeSuccess) {
      onUpgradeSuccess();
    }
    
    // Close modal after 3 seconds
    setTimeout(() => {
      onClose();
      setPaymentSuccess('');
    }, 3000);
  };

  const handlePaymentError = (error: string) => {
    console.error('❌ Payment error:', error);
    setIsPaymentProcessing(false); // Show modal again on error
    setPaymentError(error);
    setPaymentSuccess('');
  };

  // Function to handle payment start
  const handlePaymentStart = () => {
    console.log('🔵 Payment processing started - hiding modal');
    setIsPaymentProcessing(true);
    setPaymentError(''); // Clear any previous errors
  };

  // If payment was successful, show success screen
  if (paymentSuccess) {
    return createPortal(
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[99999] p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h2>
          <p className="text-gray-700 mb-6">{paymentSuccess}</p>
          <p className="text-sm text-gray-500">This window will close automatically...</p>
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[99999] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">🚀 Upgrade Your Plan</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Current Plan */}
        <div className="p-6 bg-blue-50 border-b">
          <p className="text-center text-gray-700">
            Current Plan: <span className="font-bold text-blue-600 uppercase">{currentPlan}</span>
          </p>
        </div>

        {/* Error Message */}
        {paymentError && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{paymentError}</p>
            <button 
              onClick={() => setPaymentError('')}
              className="text-red-500 hover:text-red-700 text-xs mt-2 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Plans */}
        <div className="p-6 space-y-4">
          {/* Pro Plan */}
          <div className="border-2 border-purple-200 rounded-xl p-6 bg-purple-50">
            <div className="flex items-center mb-4">
              <Crown className="w-6 h-6 text-purple-600 mr-2" />
              <h3 className="text-xl font-bold text-purple-600">Pro Plan</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              R70 <span className="text-base font-normal text-gray-600">one-time</span>
            </div>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                5 AI-generated app ideas
              </li>
              <li className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                50 AI assistant interactions
              </li>
              <li className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Priority email support
              </li>
            </ul>
            
            {currentPlan === 'pro' ? (
              <div className="w-full p-3 bg-gray-100 rounded-lg text-center text-gray-600 font-medium">
                Current Plan
              </div>
            ) : (
              <YocoPayment
                planType="pro"
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onPaymentStart={handlePaymentStart}
                className="w-full bg-purple-600 hover:bg-purple-700"
              />
            )}
          </div>

          {/* Premium Plan */}
          <div className="border-2 border-orange-200 rounded-xl p-6 bg-orange-50">
            <div className="flex items-center mb-4">
              <Star className="w-6 h-6 text-orange-600 mr-2" />
              <h3 className="text-xl font-bold text-orange-600">Premium Plan</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              R100 <span className="text-base font-normal text-gray-600">one-time</span>
            </div>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                20 AI-generated app ideas
              </li>
              <li className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                100 AI assistant interactions
              </li>
              <li className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Premium project templates
              </li>
              <li className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Advanced analytics
              </li>
            </ul>
            
            {currentPlan === 'premium' ? (
              <div className="w-full p-3 bg-gray-100 rounded-lg text-center text-gray-600 font-medium">
                Current Plan
              </div>
            ) : (
              <YocoPayment
                planType="premium"
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onPaymentStart={handlePaymentStart}
                className="w-full bg-orange-600 hover:bg-orange-700"
              />
            )}
          </div>

          {/* Ultra Plan */}
          <div className="border-2 border-blue-500 rounded-xl p-6 bg-blue-50 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                MOST POPULAR
              </span>
            </div>
            <div className="flex items-center mb-4">
              <Rocket className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-bold text-blue-600">Ultra Plan</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              R100 <span className="text-base font-normal text-gray-600">/month</span>
            </div>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <strong>Unlimited</strong> AI-generated ideas
              </li>
              <li className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <strong>Unlimited</strong> AI assistant interactions
              </li>
              <li className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Direct WhatsApp/Email support
              </li>
              <li className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                1-on-1 consultation calls
              </li>
            </ul>
            
            {currentPlan === 'ultra' ? (
              <div className="w-full p-3 bg-gray-100 rounded-lg text-center text-gray-600 font-medium">
                Current Plan
              </div>
            ) : (
              <YocoPayment
                planType="ultra"
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onPaymentStart={handlePaymentStart}
                className="w-full bg-blue-600 hover:bg-blue-700"
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 rounded-b-xl">
          <p className="text-center text-xs text-gray-500 mb-4">
            🔒 Secure payments powered by Yoco • South African payment methods accepted
          </p>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onClose}
          >
            Maybe Later
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export const UsageDisplay = ({ compact = false, showUpgradeButton = true }: UsageDisplayProps) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    if (user && (user.uid || user.id)) {
      loadUsageData();
    }
  }, [user]);

  const loadUsageData = async () => {
    if (!user || (!user.uid && !user.id)) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const userId = user.uid || user.id;
      const [subData, statsData] = await Promise.all([
        getUserSubscription(userId),
        getUserUsageStats(userId)
      ]);
      
      setSubscription(subData);
      setUsageStats(statsData);
    } catch (error) {
      console.error('Error loading usage data:', error);
      setSubscription({
        plan: 'free',
        status: 'active',
        createdAt: new Date().toISOString()
      });
      setUsageStats({
        ideasGenerated: 0,
        aiCallsUsed: 0,
        lastResetDate: new Date().toISOString(),
        currentPeriodStart: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const getPlanIcon = (plan: SubscriptionPlan) => {
    switch (plan) {
      case 'free': return <Zap className="w-4 h-4" />;
      case 'pro': return <Crown className="w-4 h-4" />;
      case 'ultra': return <Rocket className="w-4 h-4" />;
    }
  };

  const getPlanColor = (plan: SubscriptionPlan) => {
    switch (plan) {
      case 'free': return 'text-gray-600 bg-gray-100';
      case 'pro': return 'text-purple-600 bg-purple-100';
      case 'ultra': return 'text-blue-600 bg-blue-100';
    }
  };

  if (loading || !user || !subscription || !usageStats) {
    return (
      <Card className={compact ? "h-32" : ""}>
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
            <div className="h-2 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const limits = PLAN_LIMITS[subscription.plan];
  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === 0) return 0;
    return Math.min((current / limit) * 100, 100);
  };

  if (compact) {
    return (
      <>
        <Card className="border-0 shadow-sm bg-gradient-to-r from-gray-50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Badge className={`${getPlanColor(subscription.plan)} capitalize`}>
                {getPlanIcon(subscription.plan)}
                <span className="ml-1">{subscription.plan} Plan</span>
              </Badge>
              {subscription.plan === 'free' && showUpgradeButton && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs"
                  onClick={() => setShowUpgradeModal(true)}
                >
                  Upgrade
                </Button>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" />
                  Ideas
                </span>
                <span className="font-medium">
                  {limits.unlimited ? `${usageStats.ideasGenerated} (∞)` : `${usageStats.ideasGenerated}/${limits.ideas}`}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  AI Chats
                </span>
                <span className="font-medium">
                  {limits.unlimited ? `${usageStats.aiCallsUsed} (∞)` : `${usageStats.aiCallsUsed}/${limits.aiInteractions}`}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          currentPlan={subscription.plan}
          onUpgradeSuccess={loadUsageData}
        />
      </>
    );
  }

  return (
    <>
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Usage & Plan
            </CardTitle>
            <Badge className={`${getPlanColor(subscription.plan)} capitalize px-3 py-1`}>
              {getPlanIcon(subscription.plan)}
              <span className="ml-2">{subscription.plan} Plan</span>
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Ideas Usage */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-600" />
                <span className="font-medium">AI-Generated Ideas</span>
              </div>
              <span className="text-sm text-gray-600">
                {limits.unlimited 
                  ? `${usageStats.ideasGenerated} used (Unlimited)` 
                  : `${usageStats.ideasGenerated} of ${limits.ideas} used`
                }
              </span>
            </div>
            
            {!limits.unlimited && (
              <Progress 
                value={getUsagePercentage(usageStats.ideasGenerated, limits.ideas)} 
                className="h-2"
              />
            )}
          </div>

          {/* AI Interactions Usage */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span className="font-medium">AI Assistant Chats</span>
              </div>
              <span className="text-sm text-gray-600">
                {limits.unlimited 
                  ? `${usageStats.aiCallsUsed} used (Unlimited)` 
                  : `${usageStats.aiCallsUsed} of ${limits.aiInteractions} used`
                }
              </span>
            </div>
            
            {!limits.unlimited && (
              <Progress 
                value={getUsagePercentage(usageStats.aiCallsUsed, limits.aiInteractions)} 
                className="h-2"
              />
            )}
          </div>

          {/* Reset Information */}
          {subscription.plan === 'free' && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              <Clock className="w-4 h-4" />
              <span>Free tier resets monthly</span>
            </div>
          )}

          {/* Upgrade Button */}
          {subscription.plan !== 'ultra' && showUpgradeButton && (
            <div className="pt-2 border-t">
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                onClick={() => setShowUpgradeModal(true)}
              >
                {subscription.plan === 'free' ? 'Upgrade Plan' : 'Upgrade to Ultra'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentPlan={subscription.plan}
        onUpgradeSuccess={loadUsageData}
      />
    </>
  );
}; 