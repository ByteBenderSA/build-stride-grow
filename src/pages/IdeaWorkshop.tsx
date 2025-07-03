import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  Star
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

const IdeaWorkshop = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    interests: "",
    experience: "",
    timeCommitment: "",
    goals: ""
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
        
        // Strategy 2: JSON in code blocks
        () => {
          const codeBlockMatch = response.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
          return codeBlockMatch ? JSON.parse(codeBlockMatch[1]) : null;
        },
        
        // Strategy 3: JSON between curly braces
        () => {
          const jsonMatch = response.match(/(\{[\s\S]*\})/);
          return jsonMatch ? JSON.parse(jsonMatch[1]) : null;
        },
        
        // Strategy 4: Extract JSON-like content and clean it
        () => {
          let cleaned = response
            .replace(/^[^{]*/, '') // Remove everything before first {
            .replace(/[^}]*$/, '') // Remove everything after last }
            .trim();
          
          if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
            return JSON.parse(cleaned);
          }
          return null;
        }
      ];

      // Try each extraction strategy
      for (const strategy of jsonExtractionStrategies) {
        try {
          jsonData = strategy();
          if (jsonData && typeof jsonData === 'object') {
            console.log('Successfully extracted JSON:', jsonData);
            break;
          }
        } catch (e) {
          // Continue to next strategy
          continue;
        }
      }

      // Step 2: Validate and structure the JSON data
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

      // Step 3: If JSON parsing failed, fall back to smart text parsing
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
    let features = fallbackIdea.features;
    const titleLower = title.toLowerCase();
    if (titleLower.includes('mood') || titleLower.includes('wellness') || titleLower.includes('mental')) {
      features = ['Daily Mood Logging', 'Emotion Tracking', 'Wellness Insights', 'Progress Visualization', 'Data Export', 'Calendar View'];
    } else if (titleLower.includes('recipe') || titleLower.includes('food') || titleLower.includes('cooking')) {
      features = ['Recipe Storage', 'Ingredient Management', 'Meal Planning', 'Cooking Timer', 'Nutrition Tracking', 'Shopping Lists'];
    } else if (titleLower.includes('expense') || titleLower.includes('budget') || titleLower.includes('finance')) {
      features = ['Expense Tracking', 'Budget Planning', 'Category Management', 'Financial Reports', 'Goal Setting', 'Data Visualization'];
    }

    return {
      ...fallbackIdea,
      id: index + 1,
      title,
      description,
      features
    };
  };

  const handleGenerateIdeas = async () => {
    if (!user) {
      setError("Please log in to generate project ideas");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Prepare user context for AI
      const userInput = `
        Interests: ${formData.interests}
        Experience Level: ${formData.experience}
        Time Commitment: ${formData.timeCommitment}
        Goals: ${formData.goals}
      `.trim();

      // Generate multiple ideas
      const ideaPromises = Array.from({ length: 3 }, async (_, index) => {
        const prompt = `Generate a unique, creative project idea for someone learning to code.

User Context:
${userInput}

CRITICAL INSTRUCTION: Return ONLY valid JSON. No explanations, no markdown, no extra text, no code blocks, no \`\`\`json tags. Just pure JSON starting with { and ending with }.

Required JSON structure:
{
  "title": "Project Name Here",
  "description": "2-3 sentences describing what this app does, who uses it, and why it's valuable",
  "features": [
    "Feature 1: Specific and actionable",
    "Feature 2: Specific and actionable", 
    "Feature 3: Specific and actionable",
    "Feature 4: Specific and actionable",
    "Feature 5: Specific and actionable",
    "Feature 6: Specific and actionable"
  ],
  "techStack": [
    "React",
    "TypeScript", 
    "Tailwind CSS",
    "Firebase",
    "One additional relevant technology"
  ],
  "difficulty": "Beginner",
  "learningObjectives": [
    "Specific skill 1",
    "Specific skill 2", 
    "Specific skill 3",
    "Specific skill 4"
  ],
  "timeEstimate": "1-3 weeks",
  "marketPotential": "Medium"
}

Requirements:
- Must be achievable for ${formData.experience} skill level
- Should be engaging and relevant to their interests: ${formData.interests}
- Must be practical and portfolio-worthy
- Should be different from typical tutorial projects
- Focus on ${index === 0 ? 'web applications' : index === 1 ? 'mobile-first responsive projects' : 'full-stack applications with backend'}

REMEMBER: Return ONLY the JSON object. No other text whatsoever.`;

        const response = await geminiService.generateProjectIdea(prompt, formData.experience);
        return parseAIResponse(response, index);
      });

      const ideas = await Promise.all(ideaPromises);
      setGeneratedIdeas(ideas);
      setStep(2);
    } catch (err) {
      console.error('Error generating ideas:', err);
      setError('Failed to generate project ideas. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectIdea = async (idea: GeneratedIdea) => {
    if (!user) return;
    
    try {
      // Save the selected idea as a project in Firestore
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
          lovable: `Build a ${idea.title}: ${idea.description}. Features: ${idea.features.join(', ')}. Tech stack: ${idea.techStack.join(', ')}.`,
          cursor: `Help me build a ${idea.title} with the following features: ${idea.features.join(', ')}. I'm a ${formData.experience} level developer.`,
          firebase: `Set up Firebase for a ${idea.title} project with authentication and database for features: ${idea.features.slice(0, 3).join(', ')}.`
        },
        resources: {
          links: [],
          tutorials: [],
          documentation: idea.techStack.map(tech => `${tech} documentation`)
        }
      });

      // Store project ID for navigation
      setSelectedIdea({ ...idea, projectId });
      setStep(3);
    } catch (error) {
      console.error('Error saving project:', error);
      setError('Failed to save project. Please try again.');
    }
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
                {/* Error Alert */}
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-700">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div>
                  <Label htmlFor="interests">What are you interested in building?</Label>
                  <Textarea
                    id="interests"
                    placeholder="e.g., social media, productivity tools, games, e-commerce..."
                    value={formData.interests}
                    onChange={(e) => setFormData({...formData, interests: e.target.value})}
                    className="mt-1"
                    disabled={isGenerating}
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
                    disabled={isGenerating}
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
                    disabled={isGenerating}
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
                    disabled={isGenerating}
                  />
                </div>

                <Button 
                  onClick={handleGenerateIdeas}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  size="lg"
                  disabled={isGenerating || !formData.interests.trim()}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Ideas...
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

        {step === 2 && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Here are your personalized project ideas!</h2>
              <p className="text-gray-600">Each idea is tailored to your interests and skill level</p>
            </div>

            {isGenerating ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-600" />
                  <p className="text-lg font-medium mb-2">Generating your perfect project ideas...</p>
                  <p className="text-gray-600">Our AI is analyzing your preferences and creating personalized suggestions</p>
                </div>
              </div>
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
