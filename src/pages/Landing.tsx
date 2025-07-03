import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Code, Star, Users, BookOpen, Zap, CheckCircle, Sparkles, Target, Rocket } from "lucide-react";

const Landing = () => {
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI-Powered Guidance",
      description: "Get personalized mentorship 24/7 with intelligent assistance that adapts to your learning style."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Project-Based Learning",
      description: "Build real applications from day one. No more tutorial hell - create apps that matter."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Supportive Community",
      description: "Connect with fellow builders and celebrate wins together in our vibrant community."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
            <Code className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
            Companai
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost" className="text-gray-600 hover:text-purple-600 transition-colors">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 shadow-lg">
              Start Building
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-5xl mx-auto">
          <Badge className="mb-8 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200 px-6 py-3 text-sm font-medium rounded-full">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Learning Platform
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              From Idea to App in 
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Weeks, Not Years
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-4xl mx-auto">
            Master modern web development with AI-guided mentorship and hands-on projects. 
            Build real apps while learning the skills that actually matter.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-lg px-12 py-6 h-auto rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-12 py-6 h-auto rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-purple-300 transition-all duration-300">
              Watch Demo
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-medium">4.9/5 from 1,000+ students</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-500" />
              <span className="font-medium">Join 5,000+ builders</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="font-medium">Free to start</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive learning experience designed for real-world success
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className={`p-8 transition-all duration-500 border-0 shadow-lg hover:shadow-xl transform hover:scale-105 ${
              index === 0 ? 'bg-gradient-to-br from-purple-50 to-purple-100' :
              index === 1 ? 'bg-gradient-to-br from-blue-50 to-blue-100' :
              'bg-gradient-to-br from-green-50 to-green-100'
            }`}>
              <CardContent className="p-0 text-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg ${
                  index === 0 ? 'bg-gradient-to-r from-purple-600 to-purple-700' :
                  index === 1 ? 'bg-gradient-to-r from-blue-600 to-blue-700' :
                  'bg-gradient-to-r from-green-600 to-green-700'
                } text-white`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Success Story */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-8 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200 px-6 py-3 text-sm font-medium rounded-full">
              <Rocket className="w-4 h-4 mr-2" />
              Success Story
            </Badge>
            
            <Card className="p-12 border-0 shadow-2xl bg-gradient-to-br from-gray-50 to-white">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=96&h=96&fit=crop&crop=face"
                    alt="Sarah Chen"
                    className="w-24 h-24 rounded-full object-cover border-4 border-purple-100 shadow-lg"
                  />
                  <div className="flex-1 text-center md:text-left">
                    <blockquote className="text-2xl font-medium mb-6 text-gray-800 leading-relaxed">
                      "Companai turned my scattered learning into a clear path. I went from design mockups to deploying real apps in just 8 weeks!"
                    </blockquote>
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div>
                        <p className="text-xl font-bold text-gray-900">Sarah Chen</p>
                        <p className="text-purple-600 font-medium">From Designer to Full-Stack Developer</p>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <p className="text-gray-500 mb-1">Before</p>
                          <p className="font-medium text-gray-800">Struggling with tutorials</p>
                        </div>
                        <ArrowRight className="w-6 h-6 text-purple-600" />
                        <div className="text-center">
                          <p className="text-gray-500 mb-1">After</p>
                          <p className="font-medium text-green-600">Built 3 production apps</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 rounded-3xl p-16 text-white shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Future?
            </h2>
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
              Join thousands of builders who've already started their journey to becoming professional developers.
            </p>
            
            <Link to="/signup">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-12 py-6 h-auto font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Start Building Today <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            
            <div className="flex flex-wrap items-center justify-center gap-8 mt-10 text-sm opacity-90">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
              Companai
            </span>
          </div>
          <p className="text-gray-600">© 2024 Companai. Empowering the next generation of developers.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
