import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Crown, 
  Rocket, 
  Zap, 
  ArrowRight, 
  TrendingUp, 
  Clock,
  CheckCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  checkUsageLimit, 
  getPlanFeatures, 
  SubscriptionPlan,
  upgradeUserPlan
} from "@/lib/subscriptions";

interface UsageLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'idea' | 'ai';
}

export function UsageLimitModal({ isOpen, onClose, type }: UsageLimitModalProps) {
  const { user } = useAuth();
  const [usageInfo, setUsageInfo] = useState<{
    canUse: boolean;
    currentUsage: number;
    limit: number;
    plan: SubscriptionPlan;
  } | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      loadUsageInfo();
    }
  }, [isOpen, user]);

  const loadUsageInfo = async () => {
    if (!user) return;
    
    try {
      const info = await checkUsageLimit(user.uid, type);
      setUsageInfo(info);
    } catch (error) {
      console.error('Error loading usage info:', error);
    }
  };

  const handleUpgrade = async (planName: SubscriptionPlan) => {
    if (!user) return;
    
    setIsUpgrading(true);
    try {
      // In a real app, this would open Paddle checkout
      // For now, we'll simulate the upgrade
      await upgradeUserPlan(user.uid, planName);
      
      // Refresh usage info
      await loadUsageInfo();
      
      // Show success message
      alert(`Successfully upgraded to ${planName} plan!`);
      onClose();
    } catch (error) {
      console.error('Error upgrading:', error);
      alert('Failed to upgrade. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  const getFeatureType = () => {
    return type === 'idea' ? 'App Ideas' : 'AI Assistant Interactions';
  };

  const getProgressPercentage = () => {
    if (!usageInfo) return 0;
    if (usageInfo.limit === -1) return 0; // Unlimited
    return (usageInfo.currentUsage / usageInfo.limit) * 100;
  };

  const getUpgradeOptions = () => {
    const currentPlan = usageInfo?.plan || 'free';
    
    const options = [];
    
    if (currentPlan === 'free') {
      options.push({
        plan: 'pro' as SubscriptionPlan,
        name: 'Pro',
        price: 'R100 one-time',
        description: 'Perfect for individual developers',
        icon: <Crown className="w-6 h-6" />,
        color: 'from-purple-500 to-purple-600',
        features: ['5 AI-generated ideas', '50 AI assistant interactions', 'Priority support']
      });
      
      options.push({
        plan: 'ultra' as SubscriptionPlan,
        name: 'Ultra',
        price: 'R100/month',
        description: 'For serious builders',
        icon: <Rocket className="w-6 h-6" />,
        color: 'from-blue-500 to-blue-600',
        features: ['Unlimited ideas', 'Unlimited AI interactions', 'Direct support', '1-on-1 consultations']
      });
    } else if (currentPlan === 'pro') {
      options.push({
        plan: 'ultra' as SubscriptionPlan,
        name: 'Ultra',
        price: 'R100/month',
        description: 'Unlimited everything',
        icon: <Rocket className="w-6 h-6" />,
        color: 'from-blue-500 to-blue-600',
        features: ['Unlimited ideas', 'Unlimited AI interactions', 'Direct support', '1-on-1 consultations']
      });
    }
    
    return options;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            {usageInfo?.plan === 'free' ? 'Monthly' : 'Usage'} Limit Reached
          </DialogTitle>
          <DialogDescription>
            You've reached your limit for {getFeatureType().toLowerCase()}. 
            {usageInfo?.plan === 'free' && ' Your free tier resets monthly.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Usage Display */}
          {usageInfo && (
            <Card className="bg-gray-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Current Usage</CardTitle>
                  <Badge variant="outline" className="capitalize">
                    {usageInfo.plan} Plan
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{getFeatureType()}</span>
                    <span className="font-medium">
                      {usageInfo.limit === -1 
                        ? `${usageInfo.currentUsage} (Unlimited)` 
                        : `${usageInfo.currentUsage} / ${usageInfo.limit}`
                      }
                    </span>
                  </div>
                  {usageInfo.limit > 0 && (
                    <Progress value={getProgressPercentage()} className="h-2" />
                  )}
                  {usageInfo.plan === 'free' && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Resets monthly</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upgrade Options */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Upgrade Your Plan</h3>
            <div className="grid gap-4">
              {getUpgradeOptions().map((option, index) => (
                <Card key={option.plan} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                  <div className={`absolute inset-0 bg-gradient-to-r ${option.color} opacity-5`} />
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${option.color} flex items-center justify-center text-white`}>
                          {option.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{option.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                          <div className="space-y-1">
                            {option.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900 mb-2">
                          {option.price}
                        </div>
                        <Button
                          onClick={() => handleUpgrade(option.plan)}
                          disabled={isUpgrading}
                          className={`bg-gradient-to-r ${option.color} hover:shadow-lg transition-all`}
                        >
                          {isUpgrading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              Upgrading...
                            </>
                          ) : (
                            <>
                              Upgrade Now
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Alternative Actions */}
          <div className="border-t pt-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
              <div className="text-sm text-gray-600">
                Need help choosing? <Link to="/pricing" className="text-purple-600 hover:text-purple-700 underline">
                  Compare all plans
                </Link>
              </div>
              <Button variant="outline" onClick={onClose}>
                Maybe Later
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 