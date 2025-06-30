
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  Lightbulb, 
  MessageSquare, 
  Zap, 
  Star, 
  Calendar,
  Trophy,
  Target,
  BookOpen,
  LogOut
} from "lucide-react";
import AIAssistant from "@/components/AIAssistant";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [showAI, setShowAI] = useState(false);

  const progress = {
    currentLevel: "Beginner",
    nextLevel: "Intermediate",
    completionPercentage: 35,
    streakDays: 7,
    totalProjects: 2,
    completedSteps: 23
  };

  const recentActivity = [
    { action: "Completed", item: "React Fundamentals", time: "2 hours ago", type: "lesson" },
    { action: "Started", item: "Todo App Project", time: "1 day ago", type: "project" },
    { action: "Earned", item: "First Deploy Badge", time: "3 days ago", type: "achievement" }
  ];

  const quickActions = [
    {
      title: "Generate New Idea",
      description: "Get AI-powered project suggestions",
      icon: Lightbulb,
      color: "from-yellow-500 to-orange-500",
      link: "/idea-workshop"
    },
    {
      title: "Continue Building",
      description: "Resume your current project",
      icon: Code,
      color: "from-blue-500 to-purple-500",
      link: "/workspace"
    },
    {
      title: "Get Help",
      description: "Chat with your AI mentor",
      icon: MessageSquare,
      color: "from-green-500 to-teal-500",
      onClick: () => setShowAI(true)
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Code className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
              <p className="text-sm text-gray-600">Ready to build something amazing?</p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={logout}
            className="text-gray-600 hover:text-gray-900"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Overview */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Level Progress</span>
                    <Badge variant="secondary">{progress.currentLevel}</Badge>
                  </div>
                  <Progress value={progress.completionPercentage} className="h-3" />
                  <p className="text-xs text-gray-600 mt-1">
                    {progress.completionPercentage}% to {progress.nextLevel}
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{progress.streakDays}</div>
                    <div className="text-sm text-gray-600">Day Streak</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{progress.totalProjects}</div>
                    <div className="text-sm text-gray-600">Projects</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{progress.completedSteps}</div>
                    <div className="text-sm text-gray-600">Steps Done</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {quickActions.map((action, index) => (
                    <div key={index}>
                      {action.link ? (
                        <Link to={action.link}>
                          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer h-full">
                            <CardContent className="p-6 text-center h-full flex flex-col justify-center">
                              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mx-auto mb-4`}>
                                <action.icon className="w-6 h-6 text-white" />
                              </div>
                              <h3 className="font-semibold mb-2">{action.title}</h3>
                              <p className="text-sm text-gray-600">{action.description}</p>
                            </CardContent>
                          </Card>
                        </Link>
                      ) : (
                        <Card 
                          className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer h-full"
                          onClick={action.onClick}
                        >
                          <CardContent className="p-6 text-center h-full flex flex-col justify-center">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mx-auto mb-4`}>
                              <action.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-semibold mb-2">{action.title}</h3>
                            <p className="text-sm text-gray-600">{action.description}</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.action}</span> {activity.item}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  Latest Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <Star className="w-8 h-8 text-yellow-600" />
                    <div>
                      <p className="font-medium text-sm">First Deployment</p>
                      <p className="text-xs text-gray-600">Deployed your first app</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <BookOpen className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="font-medium text-sm">Quick Learner</p>
                      <p className="text-xs text-gray-600">Completed 5 lessons in a day</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      {showAI && <AIAssistant onClose={() => setShowAI(false)} />}
    </div>
  );
};

export default Dashboard;
