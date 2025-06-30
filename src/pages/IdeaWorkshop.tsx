
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  ArrowLeft, 
  Wand2, 
  Target, 
  Users, 
  Clock,
  Code,
  TrendingUp,
  CheckCircle,
  ArrowRight
} from "lucide-react";

const IdeaWorkshop = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    interests: "",
    experience: "",
    timeCommitment: "",
    goals: ""
  });
  const [generatedIdeas, setGeneratedIdeas] = useState<any[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<any>(null);

  const handleGenerateIdeas = () => {
    // Simulate AI-generated ideas based on form data
    const ideas = [
      {
        id: 1,
        title: "Personal Finance Tracker",
        description: "A modern expense tracking app with budget visualization and spending insights.",
        difficulty: "Beginner",
        timeEstimate: "2-3 weeks",
        techStack: ["React", "Firebase", "Chart.js"],
        marketPotential: "High",
        features: ["Expense categorization", "Budget goals", "Visual reports", "Mobile responsive"],
        why: "Perfect for learning CRUD operations, data visualization, and real-time updates."
      },
      {
        id: 2,
        title: "Recipe Sharing Platform",
        description: "A community-driven platform where users can share, rate, and discover new recipes.",
        difficulty: "Intermediate",
        timeEstimate: "3-4 weeks",
        techStack: ["React", "Node.js", "MongoDB"],
        marketPotential: "Medium",
        features: ["User authentication", "Recipe uploads", "Rating system", "Search & filters"],
        why: "Great for learning user authentication, file uploads, and community features."
      },
      {
        id: 3,
        title: "Local Event Finder",
        description: "Discover and promote local events in your area with real-time updates.",
        difficulty: "Advanced",
        timeEstimate: "4-6 weeks",
        techStack: ["React", "Firebase", "Google Maps API"],
        marketPotential: "High",
        features: ["Location services", "Event creation", "Social sharing", "Calendar integration"],
        why: "Excellent for learning API integration, geolocation, and complex state management."
      }
    ];
    
    setGeneratedIdeas(ideas);
    setStep(2);
  };

  const handleSelectIdea = (idea: any) => {
    setSelectedIdea(idea);
    setStep(3);
  };

  const difficultyColors = {
    Beginner: "bg-green-100 text-green-700",
    Intermediate: "bg-yellow-100 text-yellow-700",
    Advanced: "bg-red-100 text-red-700"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <Link to="/dashboard" className="flex items-center text-purple-600 hover:text-purple-700 mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Idea Workshop</h1>
              <p className="text-gray-600">Let's find your perfect project to build</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {step === 1 && (
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-xl border-0">
              <CardHeader className="text-center">
                <CardTitle className="text-xl mb-2">Tell us about yourself</CardTitle>
                <p className="text-gray-600">Help our AI understand your interests and goals</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="interests">What are you interested in building?</Label>
                  <Textarea
                    id="interests"
                    placeholder="e.g., social media, productivity tools, games, e-commerce..."
                    value={formData.interests}
                    onChange={(e) => setFormData({...formData, interests: e.target.value})}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="experience">What's your coding experience?</Label>
                  <Input
                    id="experience"
                    placeholder="e.g., Complete beginner, some HTML/CSS, React basics..."
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="timeCommitment">How much time can you dedicate?</Label>
                  <Input
                    id="timeCommitment"
                    placeholder="e.g., 1-2 hours per day, weekends only, full-time..."
                    value={formData.timeCommitment}
                    onChange={(e) => setFormData({...formData, timeCommitment: e.target.value})}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="goals">What do you want to achieve?</Label>
                  <Textarea
                    id="goals"
                    placeholder="e.g., build a portfolio, start a business, learn new skills..."
                    value={formData.goals}
                    onChange={(e) => setFormData({...formData, goals: e.target.value})}
                    className="mt-1"
                  />
                </div>

                <Button 
                  onClick={handleGenerateIdeas}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  size="lg"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Perfect Ideas
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Here are your personalized project ideas!</h2>
              <p className="text-gray-600">Each idea is tailored to your interests and skill level</p>
            </div>

            <div className="grid gap-6">
              {generatedIdeas.map((idea) => (
                <Card key={idea.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{idea.title}</h3>
                        <p className="text-gray-600 mb-4">{idea.description}</p>
                      </div>
                      <Badge className={difficultyColors[idea.difficulty as keyof typeof difficultyColors]}>
                        {idea.difficulty}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">{idea.timeEstimate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Market: {idea.marketPotential}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-600" />
                        <span className="text-sm">Community Favorite</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Tech Stack:</h4>
                      <div className="flex flex-wrap gap-2">
                        {idea.techStack.map((tech: string, index: number) => (
                          <Badge key={index} variant="outline">{tech}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Key Features:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {idea.features.map((feature: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold text-blue-900 mb-1">Why this project?</h4>
                      <p className="text-sm text-blue-800">{idea.why}</p>
                    </div>

                    <Button 
                      onClick={() => handleSelectIdea(idea)}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      Choose This Project <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 3 && selectedIdea && (
          <div className="max-w-3xl mx-auto">
            <Card className="shadow-xl border-0">
              <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl">Perfect! Let's start building</CardTitle>
                <p className="opacity-90">Your project: {selectedIdea.title}</p>
              </CardHeader>
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Project Selected Successfully!</h3>
                  <p className="text-gray-600">
                    Great choice! This project will help you learn {selectedIdea.techStack.join(", ")} 
                    and take about {selectedIdea.timeEstimate} to complete.
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <h4 className="font-semibold">What happens next?</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-purple-600">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Set up your development environment</p>
                        <p className="text-sm text-gray-600">We'll guide you through installing the necessary tools</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-purple-600">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Follow our step-by-step guide</p>
                        <p className="text-sm text-gray-600">Build your app with clear instructions and explanations</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-purple-600">3</span>
                      </div>
                      <div>
                        <p className="font-medium">Deploy and share your creation</p>
                        <p className="text-sm text-gray-600">Launch your app and add it to your portfolio</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link to="/workspace" className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" size="lg">
                      <Code className="w-4 h-4 mr-2" />
                      Start Building Now
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={() => setStep(2)} size="lg">
                    Choose Different Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeaWorkshop;
