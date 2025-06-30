
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Code, 
  CheckCircle, 
  Circle, 
  Copy, 
  ExternalLink,
  PlayCircle,
  Book,
  MessageSquare
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Workspace = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const project = {
    title: "Personal Finance Tracker",
    description: "Build a modern expense tracking app with React and Firebase",
    totalSteps: 8,
    currentProgress: 25
  };

  const steps = [
    {
      id: 1,
      title: "Project Setup",
      description: "Initialize your React project and set up the development environment",
      estimatedTime: "15 mins",
      tool: "Terminal",
      prompt: `Create a new React project with TypeScript:
npx create-react-app finance-tracker --template typescript
cd finance-tracker
npm install @mui/material @emotion/react @emotion/styled`,
      resources: [
        { title: "React Getting Started", url: "#" },
        { title: "TypeScript Basics", url: "#" }
      ]
    },
    {
      id: 2,
      title: "Design System Setup",
      description: "Set up your color palette, typography, and component library",
      estimatedTime: "20 mins",
      tool: "CSS/Styled Components",
      prompt: `Set up your design system with these modern colors:
Primary: #6366f1 (Indigo)
Secondary: #10b981 (Emerald)  
Background: #f8fafc (Slate-50)
Text: #1e293b (Slate-800)

Create a theme.ts file with these values and apply them to your App.css`,
      resources: [
        { title: "Color Theory for Apps", url: "#" },
        { title: "Material-UI Theming", url: "#" }
      ]
    },
    {
      id: 3,
      title: "Navigation & Layout",
      description: "Create the main navigation and page layout structure",
      estimatedTime: "30 mins",
      tool: "React Components",
      prompt: `Create a responsive navigation with these sections:
- Dashboard (overview of finances)
- Transactions (add/view expenses)
- Categories (organize spending)
- Reports (charts and insights)

Use React Router for navigation and create a clean sidebar layout.`,
      resources: [
        { title: "React Router Guide", url: "#" },
        { title: "Responsive Design Patterns", url: "#" }
      ]
    }
  ];

  const handleStepComplete = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
      toast({
        title: "Step completed! 🎉",
        description: "Great progress! Moving to the next step.",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "You can now paste this in your editor.",
    });
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                <p className="text-gray-600">{project.description}</p>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-700">
              Step {currentStep} of {project.totalSteps}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
                <Progress value={project.currentProgress} className="mt-2" />
                <p className="text-sm text-gray-600 mt-1">
                  {completedSteps.length} of {project.totalSteps} steps completed
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {steps.map((step) => (
                    <div
                      key={step.id}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        step.id === currentStep ? 'bg-purple-50 border border-purple-200' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setCurrentStep(step.id)}
                    >
                      {completedSteps.includes(step.id) ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{step.title}</p>
                        <p className="text-xs text-gray-500">{step.estimatedTime}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {steps.map((step) => (
              step.id === currentStep && (
                <Card key={step.id} className="shadow-xl border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{step.title}</CardTitle>
                        <p className="text-gray-600 mt-1">{step.description}</p>
                      </div>
                      <Badge variant="outline">{step.tool}</Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <Tabs defaultValue="instructions" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="instructions">Instructions</TabsTrigger>
                        <TabsTrigger value="code">Code & Prompts</TabsTrigger>
                        <TabsTrigger value="resources">Resources</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="instructions" className="mt-6">
                        <div className="prose max-w-none">
                          <h3>What you'll build in this step:</h3>
                          <p>{step.description}</p>
                          
                          <div className="bg-blue-50 p-4 rounded-lg my-4">
                            <h4 className="text-blue-900 font-semibold mb-2">📋 Step Overview</h4>
                            <ul className="text-blue-800 text-sm space-y-1">
                              <li>• Set up your development environment</li>
                              <li>• Install necessary dependencies</li>
                              <li>• Create the basic project structure</li>
                              <li>• Test your setup</li>
                            </ul>
                          </div>

                          <div className="flex gap-3 mt-6">
                            <Button
                              onClick={() => handleStepComplete(step.id)}
                              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Mark as Complete
                            </Button>
                            <Button variant="outline">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Get Help
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="code" className="mt-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Copy this prompt to your editor:</h3>
                          <div className="bg-gray-900 rounded-lg p-4 relative">
                            <pre className="text-green-400 text-sm overflow-x-auto">
                              <code>{step.prompt}</code>
                            </pre>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="absolute top-2 right-2 text-gray-400 hover:text-white"
                              onClick={() => copyToClipboard(step.prompt)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                              <PlayCircle className="w-4 h-4 mr-2" />
                              Open in Cursor
                            </Button>
                            <Button variant="outline">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Open in Lovable
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="resources" className="mt-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Helpful Resources:</h3>
                          <div className="grid gap-3">
                            {step.resources.map((resource, index) => (
                              <Card key={index} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4 flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <Book className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium">{resource.title}</span>
                                  </div>
                                  <Button size="sm" variant="ghost">
                                    <ExternalLink className="w-4 h-4" />
                                  </Button>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
