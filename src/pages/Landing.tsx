
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Code, Star, Users, BookOpen, Zap, CheckCircle } from "lucide-react";

const Landing = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "From Designer to Full-Stack Developer",
      before: "Struggling with tutorials",
      after: "Built 3 production apps",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
      quote: "BuildFlow turned my scattered learning into a clear path. I went from design mockups to deploying real apps!"
    },
    {
      name: "Mike Rodriguez",
      role: "From Marketing to SaaS Founder",
      before: "Zero coding experience",
      after: "Launched profitable SaaS",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
      quote: "The AI mentor helped me build my first SaaS in 6 weeks. Now I'm generating $5k MRR!"
    },
    {
      name: "Emily Johnson",
      role: "From Student to Startup CTO",
      before: "Overwhelmed by options",
      after: "Leading tech team",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
      quote: "The guided project approach made everything click. I'm now CTO of a funded startup!"
    }
  ];

  const tools = [
    { name: "Lovable", description: "AI-Powered Web Development", icon: "🚀" },
    { name: "Cursor", description: "AI Code Editor", icon: "⚡" },
    { name: "Firebase", description: "Backend Infrastructure", icon: "🔥" },
    { name: "Vercel", description: "Deployment Platform", icon: "▲" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Code className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            BuildFlow
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Start Building
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-purple-100 text-purple-700 hover:bg-purple-100">
            ✨ AI-Powered Learning Platform
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
            From Idea to App in Weeks, Not Years
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Master modern web development with AI-guided mentorship, hands-on projects, 
            and a supportive community. Build real apps while learning the skills that matter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-6">
                Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Tools Showcase */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Build with the Best Tools</h2>
          <p className="text-gray-600">Learn industry-standard tools used by top developers worldwide</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">{tool.icon}</div>
                <h3 className="font-semibold mb-2">{tool.name}</h3>
                <p className="text-sm text-gray-600">{tool.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Success Stories */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Real Success Stories</h2>
          <p className="text-gray-600">See how our community transformed their careers</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 mb-8">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <img 
                  src={testimonials[currentTestimonial].image} 
                  alt={testimonials[currentTestimonial].name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="flex-1 text-center md:text-left">
                  <blockquote className="text-lg italic mb-4">
                    "{testimonials[currentTestimonial].quote}"
                  </blockquote>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div>
                      <p className="font-semibold">{testimonials[currentTestimonial].name}</p>
                      <p className="text-purple-600">{testimonials[currentTestimonial].role}</p>
                    </div>
                    <div className="flex gap-8 text-sm">
                      <div>
                        <p className="text-gray-500">Before</p>
                        <p className="font-medium">{testimonials[currentTestimonial].before}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 mt-4" />
                      <div>
                        <p className="text-gray-500">After</p>
                        <p className="font-medium text-green-600">{testimonials[currentTestimonial].after}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentTestimonial ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything You Need to Succeed</h2>
          <p className="text-gray-600">Comprehensive learning experience designed for real-world success</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Guidance</h3>
              <p className="text-gray-600">Get personalized help 24/7 from our intelligent mentor that adapts to your learning style.</p>
            </CardContent>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Project-Based Learning</h3>
              <p className="text-gray-600">Build real applications from day one. No more tutorial hell or toy projects.</p>
            </CardContent>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Supportive Community</h3>
              <p className="text-gray-600">Connect with fellow builders, share progress, and celebrate wins together.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Future?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of builders who've already started their journey to becoming professional developers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6">
                Start Building Today <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Free to start
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Code className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              BuildFlow
            </span>
          </div>
          <p className="text-gray-600">© 2024 BuildFlow. Empowering the next generation of developers.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
