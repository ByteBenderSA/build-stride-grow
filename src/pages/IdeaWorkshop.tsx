import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
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
  ArrowRight,
  AlertCircle,
  Loader2,
  Rocket,
  Star,
  Brain,
  Sparkles,
  Zap
} from "lucide-react";
import { geminiService } from "@/lib/gemini";
import { useAuth } from "@/contexts/AuthContext";
import { createProject } from "@/lib/firestore";

interface GeneratedIdea {
  id: number;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeEstimate: string;
  techStack: string[];
  marketPotential: string;
  features: string[];
  why: string;
  learningObjectives: string[];
  roadmap: string[];
  projectId?: string;
}

// Enhanced Loading Component
const IdeaGenerationLoader = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { icon: Brain, text: "Analyzing your interests...", duration: 1500 },
    { icon: Sparkles, text: "Generating creative concepts...", duration: 2000 },
    { icon: Code, text: "Designing technical architecture...", duration: 1800 },
    { icon: Target, text: "Calculating market potential...", duration: 1200 },
    { icon: Zap, text: "Finalizing perfect matches...", duration: 1000 }
  ];

  const tips = [
    "💡 The best apps solve real problems for real people",
    "🚀 Start simple, then add complexity as you learn",
    "📱 Mobile-first thinking leads to better user experiences",
    "🎯 Focus on one core feature that works perfectly",
    "💪 Every expert was once a beginner - you've got this!"
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        
        // Update current step based on progress
        const stepIndex = Math.floor((newProgress / 100) * steps.length);
        setCurrentStep(Math.min(stepIndex, steps.length - 1));
        
        return Math.min(newProgress, 100);
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const currentStepData = steps[currentStep];
  const CurrentIcon = currentStepData?.icon || Brain;

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <CurrentIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Creating Your Perfect Project Ideas</h3>
            <p className="text-purple-100">Our AI is analyzing your preferences to generate personalized suggestions</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-white/20" />
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <CurrentIcon className="w-5 h-5 text-purple-600 animate-bounce" />
              <span className="font-medium text-gray-900">{currentStepData?.text}</span>
            </div>
          </div>

          {/* Loading Steps */}
          <div className="space-y-3 mb-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={index} className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                  isActive ? 'bg-purple-50 border border-purple-200' : 
                  isCompleted ? 'bg-green-50' : 'bg-gray-50'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isActive ? 'bg-purple-600 text-white animate-pulse' :
                    isCompleted ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className={`text-sm ${
                    isActive ? 'text-purple-900 font-medium' :
                    isCompleted ? 'text-green-900' : 'text-gray-600'
                  }`}>
                    {step.text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Pro Tip</h4>
                <p className="text-sm text-blue-800">{tips[currentStep % tips.length]}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Skeleton Card Component
const IdeaCardSkeleton = () => (
  <Card className="shadow-lg border-0 animate-pulse">
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded mb-4 w-full"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-20"></div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>

      <div className="mb-4">
        <div className="h-4 bg-gray-200 rounded mb-2 w-24"></div>
        <div className="flex flex-wrap gap-2">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-6 bg-gray-200 rounded w-16"></div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="h-4 bg-gray-200 rounded mb-2 w-32"></div>
        <div className="grid grid-cols-2 gap-2">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <div className="h-4 bg-gray-200 rounded mb-2 w-32"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
      </div>

      <div className="h-10 bg-gray-200 rounded w-full"></div>
    </CardContent>
  </Card>
);

const IdeaWorkshop = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    appName: "",
    appDescription: "",
    targetAudience: "",
    keyFeatures: "",
    userFlow: "",
    experience: "",
    timeCommitment: ""
  });
  const [generatedIdeas, setGeneratedIdeas] = useState<GeneratedIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<GeneratedIdea | null>(null);

  const parseAIResponse = (response: string, index: number): GeneratedIdea => {
    console.log('Raw AI Response:', response);
    
    // Robust fallback structure
    const fallbackIdea: GeneratedIdea = {
      id: index + 1,
      title: "Custom Project Idea",
      description: "A modern web application designed to help users solve real-world problems with intuitive design and powerful features.",
      difficulty: "Beginner" as const,
      timeEstimate: "2-3 weeks",
      techStack: ["React", "TypeScript", "Tailwind CSS", "Firebase"],
      marketPotential: "Medium",
      features: ["User Registration & Authentication", "Data Input & Management", "Real-time Updates", "Responsive Design", "User Dashboard", "Export Functionality"],
      why: "Perfect for learning modern web development",
      learningObjectives: ["React Components", "State Management", "Database Integration", "UI/UX Design"],
      roadmap: ["Project Setup", "User Interface", "Backend Integration", "Testing & Polish", "Deployment"]
    };

    try {
      // Step 1: Try to extract and parse JSON from the response
      let jsonData = null;
      
      // Multiple strategies to extract JSON
      const jsonExtractionStrategies = [
        // Strategy 1: Direct JSON (ideal case)
        () => JSON.parse(response.trim()),
        
        // Strategy 2: JSON Array in code blocks
        () => {
          const codeBlockMatch = response.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
          return codeBlockMatch ? JSON.parse(codeBlockMatch[1]) : null;
        },
        
        // Strategy 3: JSON Object in code blocks
        () => {
          const codeBlockMatch = response.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
          return codeBlockMatch ? JSON.parse(codeBlockMatch[1]) : null;
        },
        
        // Strategy 4: JSON Array between brackets
        () => {
          const jsonMatch = response.match(/(\[[\s\S]*\])/);
          return jsonMatch ? JSON.parse(jsonMatch[1]) : null;
        },
        
        // Strategy 5: JSON Object between curly braces
        () => {
          const jsonMatch = response.match(/(\{[\s\S]*\})/);
          return jsonMatch ? JSON.parse(jsonMatch[1]) : null;
        },
        
        // Strategy 6: Extract JSON-like content and clean it
        () => {
          let cleaned = response
            .replace(/^[^{[]*/, '') // Remove everything before first { or [
            .replace(/[^}\]]*$/, '') // Remove everything after last } or ]
            .trim();
          
          if ((cleaned.startsWith('{') && cleaned.endsWith('}')) || 
              (cleaned.startsWith('[') && cleaned.endsWith(']'))) {
            return JSON.parse(cleaned);
          }
          return null;
        }
      ];

      // Try each extraction strategy
      for (const strategy of jsonExtractionStrategies) {
        try {
          jsonData = strategy();
          if (jsonData && (typeof jsonData === 'object' || Array.isArray(jsonData))) {
            console.log('Successfully extracted JSON:', jsonData);
            break;
          }
        } catch (e) {
          // Continue to next strategy
          continue;
        }
      }

      // Step 2: Handle array responses (multiple ideas)
      if (Array.isArray(jsonData)) {
        console.log('Processing array of ideas, selecting index:', index);
        const ideaData = jsonData[index] || jsonData[0] || null;
        if (ideaData) {
          jsonData = ideaData;
        } else {
          console.log('No valid idea found at index, falling back');
          jsonData = null;
        }
      }

      // Step 3: Validate and structure the JSON data
      if (jsonData) {
        const validateField = (field: any, fallback: any) => {
          return field && (typeof field === typeof fallback) ? field : fallback;
        };

        const validateArray = (arr: any, fallback: any[], maxLength = 10) => {
          if (Array.isArray(arr) && arr.length > 0) {
            return arr.filter(item => typeof item === 'string' && item.trim().length > 0).slice(0, maxLength);
          }
          return fallback;
        };

        const validateDifficulty = (diff: any): 'Beginner' | 'Intermediate' | 'Advanced' => {
          const validDifficulties = ['Beginner', 'Intermediate', 'Advanced'];
          return validDifficulties.includes(diff) ? diff : 'Beginner';
        };

        const result: GeneratedIdea = {
          id: index + 1,
          title: validateField(jsonData.title, fallbackIdea.title),
          description: validateField(jsonData.description, fallbackIdea.description),
          difficulty: validateDifficulty(jsonData.difficulty),
          timeEstimate: validateField(jsonData.timeEstimate, fallbackIdea.timeEstimate),
          techStack: validateArray(jsonData.techStack, fallbackIdea.techStack, 6),
          marketPotential: validateField(jsonData.marketPotential, fallbackIdea.marketPotential),
          features: validateArray(jsonData.features, fallbackIdea.features, 8),
          learningObjectives: validateArray(jsonData.learningObjectives, fallbackIdea.learningObjectives, 6),
          why: `Perfect for learning ${jsonData.learningObjectives?.slice(0, 2).join(" and ") || "development skills"}`,
          roadmap: ["UI Design & Planning", "Core Feature Development", "Database Integration", "Testing & Polish", "Deployment & Launch"]
        };

        console.log('Successfully parsed JSON result:', result);
        return result;
      }

      // Step 4: If JSON parsing failed, fall back to smart text parsing
      console.log('JSON parsing failed, falling back to text parsing');
      return parseTextFallback(response, index, fallbackIdea);

    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      return {
        ...fallbackIdea,
        title: `Project Idea ${index + 1}`,
        description: response.slice(0, 200) + "..."
      };
    }
  };

  // Fallback text parsing function
  const parseTextFallback = (response: string, index: number, fallbackIdea: GeneratedIdea): GeneratedIdea => {
    const cleanResponse = response.replace(/\*\*/g, '').trim();
    
    // Extract title
    let title = "";
    const titleMatch = cleanResponse.match(/(?:title|name|project):\s*["']?([^"\n]+)["']?/i);
    if (titleMatch) {
      title = titleMatch[1].trim();
    } else {
      const lines = cleanResponse.split('\n').filter(l => l.trim());
      title = lines[0]?.replace(/^\d+\.\s*/, '').trim() || fallbackIdea.title;
    }

    // Extract description
    let description = "";
    const descMatch = cleanResponse.match(/(?:description|about|overview):\s*(.+?)(?:\n\n|\n[A-Z]|$)/is);
    if (descMatch) {
      description = descMatch[1].trim();
    } else {
      description = cleanResponse.slice(0, 200) + "...";
    }

    // Smart feature generation based on title keywords
    const keywords = title.toLowerCase();
    let features = fallbackIdea.features;
    
    if (keywords.includes('fitness') || keywords.includes('health')) {
      features = ["Workout Tracking", "Progress Analytics", "Goal Setting", "Exercise Library", "Social Sharing", "Nutrition Logging"];
    } else if (keywords.includes('task') || keywords.includes('todo') || keywords.includes('productivity')) {
      features = ["Task Creation", "Due Date Reminders", "Priority Levels", "Categories", "Progress Tracking", "Team Collaboration"];
    } else if (keywords.includes('social') || keywords.includes('chat') || keywords.includes('community')) {
      features = ["User Profiles", "Real-time Messaging", "Friend System", "Content Sharing", "Notifications", "Privacy Controls"];
    }

    return {
      id: index + 1,
      title,
      description,
      difficulty: 'Beginner' as const,
      timeEstimate: "2-3 weeks",
      techStack: ["React", "TypeScript", "Tailwind CSS", "Firebase"],
      marketPotential: "Medium",
      features,
      why: `Perfect for learning ${keywords.includes('mobile') ? 'mobile development' : 'web development'}`,
      learningObjectives: ["React Components", "State Management", "Database Integration", "UI/UX Design"],
      roadmap: ["Project Setup", "User Interface", "Backend Integration", "Testing & Polish", "Deployment"]
    };
  };

  const handleGenerateIdeas = async () => {
    if (!formData.appName.trim()) return;

    setIsGenerating(true);
    setError(null);
    setStep(2);

    try {
      const userInput = `
        App Name: ${formData.appName}
        App Description: ${formData.appDescription}
        Target Audience: ${formData.targetAudience}
        Key Features: ${formData.keyFeatures}
        User Flow: ${formData.userFlow}
        Experience Level: ${formData.experience}
        Time Commitment: ${formData.timeCommitment}
      `;

                   const response = await geminiService.generateProjectIdea(userInput);
      console.log('Raw Gemini Response:', response);

      // Parse the ideas from the response
      let ideas: GeneratedIdea[] = [];
      
      try {
        // First try to parse as a single JSON array
        let jsonData = null;
        
        // Try to extract JSON array from the response
        const jsonExtractionStrategies = [
          // Strategy 1: Direct JSON array
          () => JSON.parse(response.trim()),
          
          // Strategy 2: JSON array in code blocks
          () => {
            const codeBlockMatch = response.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
            return codeBlockMatch ? JSON.parse(codeBlockMatch[1]) : null;
          },
          
          // Strategy 3: Extract JSON array content
          () => {
            const jsonMatch = response.match(/(\[[\s\S]*\])/);
            return jsonMatch ? JSON.parse(jsonMatch[1]) : null;
          }
        ];

        // Try each extraction strategy
        for (const strategy of jsonExtractionStrategies) {
          try {
            jsonData = strategy();
            if (Array.isArray(jsonData) && jsonData.length > 0) {
              console.log('Successfully extracted JSON array:', jsonData);
              break;
            }
          } catch (e) {
            continue;
          }
        }

        // If we got a JSON array, process each idea
        if (Array.isArray(jsonData)) {
          ideas = jsonData.map((ideaData, index) => {
            const validateField = (field: any, fallback: any) => {
              return field && (typeof field === typeof fallback) ? field : fallback;
            };

            const validateArray = (arr: any, fallback: any[], maxLength = 10) => {
              if (Array.isArray(arr) && arr.length > 0) {
                return arr.filter(item => typeof item === 'string' && item.trim().length > 0).slice(0, maxLength);
              }
              return fallback;
            };

            const validateDifficulty = (diff: any): 'Beginner' | 'Intermediate' | 'Advanced' => {
              const validDifficulties = ['Beginner', 'Intermediate', 'Advanced'];
              return validDifficulties.includes(diff) ? diff : 'Beginner';
            };

            return {
              id: index + 1,
              title: validateField(ideaData.title, `Project Idea ${index + 1}`),
              description: validateField(ideaData.description, "A modern web application with innovative features."),
              difficulty: validateDifficulty(ideaData.difficulty),
              timeEstimate: validateField(ideaData.timeEstimate, "2-3 weeks"),
              techStack: validateArray(ideaData.techStack, ["React", "TypeScript", "Tailwind CSS", "Firebase"], 6),
              marketPotential: validateField(ideaData.marketPotential, "Medium"),
              features: validateArray(ideaData.features, ["User Interface", "Data Management", "User Authentication", "Responsive Design"], 8),
              learningObjectives: validateArray(ideaData.learningObjectives, ["React Development", "Database Integration", "UI/UX Design"], 6),
              why: `Perfect for learning ${ideaData.learningObjectives?.slice(0, 2).join(" and ") || "development skills"}`,
              roadmap: ["UI Design & Planning", "Core Feature Development", "Database Integration", "Testing & Polish", "Deployment & Launch"]
            };
          }).filter(idea => idea.title && idea.description);
        } else {
          // Fallback to splitting by --- if not a JSON array
          console.log('Not a JSON array, trying to split by ---');
          ideas = response.split('---').map((ideaText, index) => 
            parseAIResponse(ideaText.trim(), index)
          ).filter(idea => idea.title && idea.description);
        }
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        // Fallback to splitting by --- if JSON parsing fails
        ideas = response.split('---').map((ideaText, index) => 
          parseAIResponse(ideaText.trim(), index)
        ).filter(idea => idea.title && idea.description);
      }

      // Ensure we have at least 3 ideas
      const finalIdeas = ideas.length >= 3 ? ideas.slice(0, 3) : [
        ...ideas,
        ...Array(3 - ideas.length).fill(null).map((_, index) => ({
          id: ideas.length + index + 1,
          title: `Custom Project ${ideas.length + index + 1}`,
          description: "A tailored project based on your interests and skill level.",
          difficulty: 'Beginner' as const,
          timeEstimate: "2-3 weeks",
          techStack: ["React", "TypeScript", "Tailwind CSS", "Firebase"],
          marketPotential: "Medium",
          features: ["User Interface", "Data Management", "User Authentication", "Responsive Design"],
          why: "Perfect for building practical development skills",
          learningObjectives: ["React Development", "Database Integration", "UI/UX Design"],
          roadmap: ["Setup", "Development", "Testing", "Deployment"]
        }))
      ];

      setGeneratedIdeas(finalIdeas);
    } catch (err) {
      console.error('Error generating ideas:', err);
      setError('Failed to generate ideas. Please try again.');
      setStep(1);
    } finally {
      // Add a minimum delay to show the loading animation
      setTimeout(() => {
      setIsGenerating(false);
      }, 3000);
    }
  };

  const handleSelectIdea = async (idea: GeneratedIdea) => {
    if (!user) return;
    
    try {
      const projectId = await createProject({
        ownerId: user.id,
        title: idea.title,
        description: idea.description,
        category: 'AI Generated',
        difficulty: idea.difficulty,
        techStack: idea.techStack,
        features: idea.features,
        timeEstimate: idea.timeEstimate,
        marketPotential: idea.marketPotential as 'Low' | 'Medium' | 'High',
        status: 'planning',
        progress: {
          currentStep: 0,
          totalSteps: idea.roadmap.length,
          completedSteps: [],
          lastWorkedOn: new Date().toISOString()
        },
        prompts: {
          lovable: `Create a modern, responsive web application called "${idea.title}":

**App Overview:** ${idea.description}

**Target Users:** ${formData.targetAudience}

**Core User Experience:**
${formData.userFlow}

**Essential Features to Include:**
${idea.features.map(feature => `• ${feature}`).join('\n')}

**Design Requirements:**
• Clean, modern UI with intuitive navigation
• Mobile-responsive design
• Professional color scheme and typography
• User-friendly forms and interactions
• Loading states and feedback
• Accessible design principles

**Key Pages/Screens:**
• Landing/welcome page
• User authentication (login/signup)
• Main application interface
• User dashboard/profile
• Settings/preferences

**Technical Specs:**
• Use React with TypeScript
• Implement responsive design with Tailwind CSS
• Include proper routing and navigation
• Add form validation and error handling
• Ensure mobile-first responsive layout

Focus on creating an engaging, professional frontend that delivers excellent user experience.`,
          
          cursor: `I'm building "${idea.title}" - ${idea.description}

**My Experience Level:** ${formData.experience}
**Target Audience:** ${formData.targetAudience}

**Application Architecture Needed:**
${idea.features.map(feature => `• ${feature}`).join('\n')}

**User Flow to Implement:**
${formData.userFlow}

**Technical Implementation Help Needed:**

1. **Backend Setup & Database:**
   - Firebase configuration and setup
   - Database schema design for user data
   - Authentication implementation
   - Data security and validation rules

2. **API Integration:**
   - RESTful API design patterns
   - Error handling and data validation
   - Real-time data synchronization
   - Third-party service integration

3. **Frontend Logic:**
   - State management best practices
   - Component architecture and reusability
   - Form handling and validation
   - User experience optimization

4. **Code Quality & Best Practices:**
   - TypeScript implementation
   - Code organization and file structure
   - Testing strategies
   - Performance optimization
   - Security considerations

**Specific Areas I Need Guidance On:**
- Code architecture and project structure
- Implementation of complex features
- Best practices for ${idea.techStack.join(', ')}
- Debugging and troubleshooting
- Code review and optimization

Please provide step-by-step guidance, code examples, and explain the reasoning behind technical decisions.`
        },
        resources: {
          links: [],
          tutorials: [],
          documentation: idea.techStack.map(tech => `${tech} documentation`)
        }
      });

      setSelectedIdea({ ...idea, projectId });
      setStep(3);
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Failed to save project. Please try again.');
    }
  };

  const difficultyColors = {
    'Beginner': 'bg-green-100 text-green-700',
    'Intermediate': 'bg-yellow-100 text-yellow-700', 
    'Advanced': 'bg-red-100 text-red-700'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-6 py-8">
      {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
              </Button>
          </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI Idea Workshop
              </h1>
              <p className="text-gray-600 mt-1">Transform your vision into a detailed development plan</p>
            </div>
          </div>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Step 1: Input Form */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-xl border-0">
              <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                  <Lightbulb className="w-6 h-6" />
                  Tell us about your vision
                </CardTitle>
                <p className="mt-2 opacity-90">The more details you share, the better ideas we can generate</p>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div>
                  <Label htmlFor="appName" className="text-base font-semibold">
                    App Name *
                  </Label>
                  <p className="text-sm text-gray-600 mb-2">
                    What's the name of your app?
                  </p>
                  <Input
                    id="appName"
                    placeholder="e.g., FitTrack, RecipeShare, LocalBizFinder, FinTrack..."
                    value={formData.appName}
                    onChange={(e) => setFormData({...formData, appName: e.target.value})}
                    className="mt-1"
                    disabled={isGenerating}
                  />
                </div>

                <div>
                  <Label htmlFor="appDescription" className="text-base font-semibold">
                    App Description *
                  </Label>
                  <p className="text-sm text-gray-600 mb-2">
                    Describe your app in a few sentences
                  </p>
                  <Textarea
                    id="appDescription"
                    placeholder="e.g., A fitness tracking app that helps users achieve their goals..."
                    value={formData.appDescription}
                    onChange={(e) => setFormData({...formData, appDescription: e.target.value})}
                    className="mt-1 min-h-[100px]"
                    disabled={isGenerating}
                  />
                </div>

                <div>
                  <Label htmlFor="targetAudience" className="text-base font-semibold">
                    Target Audience *
                  </Label>
                  <p className="text-sm text-gray-600 mb-2">
                    Who are you designing this app for?
                  </p>
                  <Input
                    id="targetAudience"
                    placeholder="e.g., fitness enthusiasts, recipe lovers, local business owners, personal finance managers..."
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                    className="mt-1"
                    disabled={isGenerating}
                  />
                </div>

                <div>
                  <Label htmlFor="keyFeatures" className="text-base font-semibold">
                    Key Features *
                  </Label>
                  <p className="text-sm text-gray-600 mb-2">
                    What are the main features of your app?
                  </p>
                  <Textarea
                    id="keyFeatures"
                    placeholder="e.g., user registration, data input, real-time updates, responsive design..."
                    value={formData.keyFeatures}
                    onChange={(e) => setFormData({...formData, keyFeatures: e.target.value})}
                    className="mt-1 min-h-[100px]"
                    disabled={isGenerating}
                  />
                </div>

                <div>
                  <Label htmlFor="userFlow" className="text-base font-semibold">
                    User Flow *
                  </Label>
                  <p className="text-sm text-gray-600 mb-2">
                    Describe the typical user flow of your app
                  </p>
                                     <Textarea
                     id="userFlow"
                     placeholder="e.g., 1. User signs up with email, 2. They upload a topic or ask a question, 3. AI processes and gives explanation, 4. User can review chat history..."
                     value={formData.userFlow}
                     onChange={(e) => setFormData({...formData, userFlow: e.target.value})}
                     className="mt-1 min-h-[100px]"
                     disabled={isGenerating}
                   />
                </div>

                <div>
                  <Label htmlFor="experience" className="text-base font-semibold">
                    What's your development experience?
                  </Label>
                  <p className="text-sm text-gray-600 mb-2">
                    Help us tailor the complexity to your skill level
                  </p>
                  <Input
                    id="experience"
                    placeholder="e.g., complete beginner, some HTML/CSS, built a few projects..."
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="mt-1"
                    disabled={isGenerating}
                  />
                </div>

                <div>
                  <Label htmlFor="timeCommitment" className="text-base font-semibold">
                    How much time can you dedicate?
                  </Label>
                  <p className="text-sm text-gray-600 mb-2">
                    This helps us scope the project appropriately
                  </p>
                  <Input
                    id="timeCommitment"
                    placeholder="e.g., 2-3 hours per week, evenings only, full-time..."
                    value={formData.timeCommitment}
                    onChange={(e) => setFormData({...formData, timeCommitment: e.target.value})}
                    className="mt-1"
                    disabled={isGenerating}
                  />
                </div>

                <Button 
                  onClick={handleGenerateIdeas}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  size="lg"
                  disabled={isGenerating || !formData.appName.trim()}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Your Ideas...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate Perfect Ideas
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Generated Ideas */}
        {step === 2 && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Here are your personalized project ideas!</h2>
              <p className="text-gray-600">Each idea is tailored to your interests and skill level</p>
            </div>

            {isGenerating ? (
              <IdeaGenerationLoader />
            ) : (
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
            )}

            {!isGenerating && generatedIdeas.length > 0 && (
              <div className="text-center mt-8">
                <Button 
                  onClick={handleGenerateIdeas}
                  variant="outline"
                  size="lg"
                  disabled={isGenerating}
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate New Ideas
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Project Selected */}
        {step === 3 && selectedIdea && (
          <div className="max-w-3xl mx-auto">
            <Card className="shadow-xl border-0">
              <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl">Perfect! Let's start building</CardTitle>
                <p className="mt-2 opacity-90">Your project has been saved and you're ready to begin</p>
              </CardHeader>
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{selectedIdea.title}</h3>
                  <p className="text-gray-600">{selectedIdea.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4 className="font-semibold mb-3">What you'll build:</h4>
                    <div className="space-y-2">
                      {selectedIdea.features.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">What you'll learn:</h4>
                    <div className="space-y-2">
                      {selectedIdea.learningObjectives.map((objective: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm">{objective}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={() => navigate('/workspace')}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    size="lg"
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    Start Building Now
                  </Button>
                  <Button 
                    onClick={() => navigate('/dashboard')}
                    variant="outline"
                    size="lg"
                  >
                    Back to Dashboard
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
