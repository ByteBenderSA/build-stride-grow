import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { getUserSubscription } from "@/lib/subscriptions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Zap, 
  Crown, 
  Rocket, 
  MessageSquare, 
  Lightbulb, 
  HeadphonesIcon,
  Sparkles,
  ArrowRight,
  Star
} from "lucide-react";

const Pricing = () => {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<string>('free');

  useEffect(() => {
    if (user) {
      loadCurrentPlan();
    }
  }, [user]);

  const loadCurrentPlan = async () => {
    if (!user) return;
    
    try {
      const subscription = await getUserSubscription(user.uid);
      setCurrentPlan(subscription?.plan || 'free');
    } catch (error) {
      console.error('Error loading current plan:', error);
    }
  };

  const plans = [
    {
      name: "Free",
      price: "R0",
      period: "forever",
      description: "Perfect for trying out the platform",
      icon: <Zap className="w-6 h-6" />,
      color: "from-gray-400 to-gray-500",
      cardColor: "from-gray-50 to-gray-100",
      features: [
        "1 AI-generated app idea",
        "5 AI assistant interactions",
        "Basic project templates",
        "Community support",
        "Export to PDF"
      ],
      buttonText: "Get Started Free",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Pro",
      price: "R70",
      period: "one-time",
      description: "Great for getting started",
      icon: <Crown className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600",
      cardColor: "from-purple-50 to-purple-100",
      features: [
        "5 AI-generated app ideas",
        "50 AI assistant interactions",
        "Advanced project templates",
        "Priority email support",
        "Export to multiple formats",
        "Development roadmaps"
      ],
      buttonText: "Upgrade to Pro",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Premium",
      price: "R100",
      period: "one-time",
      description: "Perfect for serious developers",
      icon: <Star className="w-6 h-6" />,
      color: "from-orange-500 to-orange-600",
      cardColor: "from-orange-50 to-orange-100",
      features: [
        "20 AI-generated app ideas",
        "100 AI assistant interactions",
        "Premium project templates",
        "Priority email support",
        "Export to multiple formats",
        "Custom branding options",
        "Development roadmaps",
        "Advanced analytics"
      ],
      buttonText: "Upgrade to Premium",
      buttonVariant: "default" as const,
      popular: false
    },
    {
      name: "Ultra",
      price: "R100",
      period: "per month",
      description: "For agencies and power users",
      icon: <Rocket className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
      cardColor: "from-blue-50 to-blue-100",
      features: [
        "Unlimited AI-generated ideas",
        "Unlimited AI assistant interactions",
        "Premium project templates",
        "Direct WhatsApp/Email support",
        "Custom integrations",
        "Advanced analytics",
        "API access",
        "White-label options",
        "1-on-1 consultation calls"
      ],
      buttonText: "Go Ultra",
      buttonVariant: "default" as const,
      popular: false
    }
  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="container mx-auto px-6 py-16 text-center">
        <Badge className="mb-8 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200 px-6 py-3 text-sm font-medium rounded-full">
          <Sparkles className="w-4 h-4 mr-2" />
          Simple, Transparent Pricing
        </Badge>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Choose Your
          </span>
          <br />
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI Development Plan
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Start free, upgrade when you need more power. No hidden fees, no long-term contracts.
        </p>

        {/* User Status (Optional - for logged in users) */}
        {user && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 max-w-md mx-auto">
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-green-800 font-medium">
                Current Plan: {currentPlan.toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 mb-12">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="font-medium">Proudly South African</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span className="font-medium">Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <HeadphonesIcon className="w-4 h-4 text-purple-500" />
            <span className="font-medium">Local support</span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-6 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name} 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:scale-105 border-0 shadow-lg ${
                plan.popular ? 'ring-2 ring-purple-500 ring-opacity-50' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className={`absolute inset-0 bg-gradient-to-br ${plan.cardColor} opacity-50`} />
              
              <CardHeader className={`relative z-10 text-center ${plan.popular ? 'pt-12' : 'pt-8'}`}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg bg-gradient-to-r ${plan.color} text-white`}>
                  {plan.icon}
                </div>
                
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </CardTitle>
                
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 ml-2">/{plan.period}</span>
                </div>
                
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                {/* Render different buttons based on plan and user status */}
                {plan.name === 'Free' ? (
                  !user ? (
                    <Link to="/signup">
                      <Button 
                        className="w-full text-lg py-6 h-auto rounded-xl shadow-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-xl"
                        variant="outline"
                      >
                        Get Started Free
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  ) : currentPlan === plan.name.toLowerCase() ? (
                    <Button 
                      className="w-full text-lg py-6 h-auto rounded-xl shadow-lg bg-gray-400 cursor-not-allowed"
                      disabled
                    >
                      Current Plan
                    </Button>
                  ) : (
                    <Link to="/dashboard">
                      <Button 
                        className="w-full text-lg py-6 h-auto rounded-xl shadow-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-xl"
                        variant="outline"
                      >
                        Switch to Free
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  )
                ) : !user ? (
                  <Link to="/signup">
                    <Button 
                      className={`w-full text-lg py-6 h-auto rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 text-white bg-gradient-to-r ${plan.color} hover:shadow-xl`}
                    >
                      Start with {plan.name}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                ) : currentPlan === plan.name.toLowerCase() ? (
                  <Button 
                    className="w-full text-lg py-6 h-auto rounded-xl shadow-lg bg-gray-400 cursor-not-allowed"
                    disabled
                  >
                    Current Plan
                  </Button>
                ) : (
                  <Link to="/dashboard">
                    <Button 
                      className={`w-full text-lg py-6 h-auto rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 text-white bg-gradient-to-r ${plan.color} hover:shadow-xl`}
                    >
                      Upgrade to {plan.name}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                )}
              </CardHeader>
              
              <CardContent className="relative z-10">
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about our pricing and features
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">What happens when I reach my limits?</h3>
                <p className="text-gray-600">You'll be notified when you're close to your limits and can easily upgrade to continue using the platform.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Can I change plans anytime?</h3>
                <p className="text-gray-600">Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Are Pro and Premium plans really one-time?</h3>
                <p className="text-gray-600">Yes! Pro (R70) and Premium (R100) are one-time payments with no recurring fees. Only Ultra is monthly.</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">How do I upgrade my plan?</h3>
                <p className="text-gray-600">After signing up, you can upgrade your plan from within your dashboard. We accept all major credit cards and South African payment methods.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Do you offer refunds?</h3>
                <p className="text-gray-600">Yes, we offer a 30-day money-back guarantee if you're not satisfied with your purchase.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Can I get help with my projects?</h3>
                <p className="text-gray-600">Ultra plan includes direct support and 1-on-1 consultation calls. Pro and Free users get community support.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Ready to Build Your Next App?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of developers who are already building with AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg px-12 py-6 h-auto rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                Start Building Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="text-lg px-12 py-6 h-auto rounded-xl border-2 hover:shadow-xl transition-all duration-300">
                View Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            By signing up, you agree to our{" "}
            <Link to="/terms" className="text-purple-600 hover:text-purple-700 underline">
              Terms of Service
            </Link>
            {" "}and{" "}
            <Link to="/privacy" className="text-purple-600 hover:text-purple-700 underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing; 