import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  Zap, 
  Heart,
  GraduationCap,
  Rocket,
  Users
} from "lucide-react";

export type OnboardingPath = 'beginner' | 'experienced' | 'both';

interface WelcomeModalProps {
  isOpen: boolean;
  onSelectPath: (path: OnboardingPath) => void;
}

const WelcomeModal = ({ isOpen, onSelectPath }: WelcomeModalProps) => {
  const [selectedPath, setSelectedPath] = useState<OnboardingPath | null>(null);

  const handlePathSelection = (path: OnboardingPath) => {
    setSelectedPath(path);
    // Add a small delay to show selection before closing
    setTimeout(() => {
      onSelectPath(path);
    }, 200);
  };

  const pathOptions = [
    {
      id: 'beginner' as OnboardingPath,
      title: "I'm New to Modern Tech",
      description: "Show me the ropes! I want to learn the tools and get guided help.",
      icon: GraduationCap,
      color: "from-green-500 to-emerald-500",
      features: [
        "Guided tutorials and lessons",
        "Step-by-step onboarding",
        "Learning achievements",
        "Friendly explanations"
      ]
    },
    {
      id: 'experienced' as OnboardingPath,
      title: "I'm Experienced / Ready to Build",
      description: "Skip the basics. Take me straight to building and advanced features.",
      icon: Rocket,
      color: "from-blue-500 to-cyan-500",
      features: [
        "Direct access to builder",
        "Minimal onboarding",
        "Professional interface",
        "Advanced tools focus"
      ]
    },
    {
      id: 'both' as OnboardingPath,
      title: "I Want to Learn & Build",
      description: "Perfect balance of learning and doing. Show me both paths!",
      icon: Heart,
      color: "from-purple-500 to-pink-500",
      features: [
        "Flexible learning path",
        "Build while you learn",
        "Best of both worlds",
        "Adaptive experience"
      ]
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <DialogHeader className="p-8 pb-4 text-center bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to BuildFlow! 🚀
          </DialogTitle>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            BuildFlow helps you turn ideas into real apps while learning modern development tools. 
            Let's customize your experience based on your background.
          </p>
        </DialogHeader>
        
        <div className="p-8 pt-4">
          <h3 className="text-xl font-semibold text-center mb-6 text-gray-800">
            What best describes you?
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {pathOptions.map((option) => {
              const IconComponent = option.icon;
              const isSelected = selectedPath === option.id;
              
              return (
                <Card 
                  key={option.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                    isSelected ? 'ring-2 ring-purple-500 ring-opacity-50 shadow-lg' : ''
                  }`}
                  onClick={() => handlePathSelection(option.id)}
                >
                  <CardHeader className="pb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${option.color} flex items-center justify-center mb-3`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{option.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {option.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {option.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className={`w-full mt-4 ${
                        isSelected 
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      variant={isSelected ? "default" : "ghost"}
                    >
                      {isSelected ? 'Selected!' : 'Choose This Path'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Don't worry - you can always change your preferences later in settings.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal; 