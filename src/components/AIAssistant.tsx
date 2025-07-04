import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, X, Send, MessageSquare, Lightbulb, Code, HelpCircle, Bot, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { conversationService, Message as ConversationMessage } from "@/lib/conversations";
import { geminiService, ChatMessage } from "@/lib/gemini";
import { Timestamp } from "firebase/firestore";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AIAssistantProps {
  onClose: () => void;
}

interface UIMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isLoading?: boolean;
}

const AIAssistant = ({ onClose }: AIAssistantProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const quickSuggestions = [
    { icon: Lightbulb, text: "Give me a project idea", color: "bg-yellow-100 text-yellow-700" },
    { icon: Code, text: "Help debug my code", color: "bg-blue-100 text-blue-700" },
    { icon: HelpCircle, text: "Explain React hooks", color: "bg-green-100 text-green-700" },
  ];

  // Initialize conversation
  useEffect(() => {
    const initializeConversation = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Create a new conversation
        const newConversationId = await conversationService.createConversation(user, 'AI Chat Session');
        setConversationId(newConversationId);
        
        // Add welcome message
        await conversationService.addMessage(
          newConversationId,
          "Hi! I'm your AI coding mentor. I can help you with project ideas, debugging, learning concepts, or just provide guidance. What would you like to work on today?",
          'assistant',
          { aiModel: 'gemini-2.0-flash' }
        );
        
        setIsInitialized(true);
      } catch (err) {
        console.error('Error initializing conversation:', err);
        setError('Failed to initialize chat. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeConversation();
  }, [user]);

  // Subscribe to messages
  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = conversationService.subscribeToMessages(
      conversationId,
      (firestoreMessages: ConversationMessage[]) => {
        const uiMessages: UIMessage[] = firestoreMessages.map(msg => ({
          id: msg.id,
          content: msg.content,
          role: msg.role,
          timestamp: msg.timestamp ? msg.timestamp.toDate() : new Date()
        }));
        setMessages(uiMessages);
      }
    );

    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [conversationId]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !conversationId || !user || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      // Analyze user message for metadata
      const messageAnalysis = await geminiService.analyzeUserMessage(content);

      // Add user message to Firestore
      await conversationService.addMessage(
        conversationId,
        content,
        'user',
        {
          intent: messageAnalysis.intent,
          topics: messageAnalysis.topics
        }
      );

      // Update conversation title if this is the first user message
      const messageCount = messages.filter(m => m.role === 'user').length;
      if (messageCount === 0) {
        await conversationService.updateConversationTitle(conversationId, content);
      }

      // Get recent messages for context
      const recentMessages = await conversationService.getRecentMessagesForContext(conversationId);
      
      // Convert to ChatMessage format for Gemini
      const chatMessages: ChatMessage[] = recentMessages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: msg.content
      }));

      // Get conversation context
      const conversation = await conversationService.getConversation(conversationId);
      const context = conversation?.context;

      // Generate AI response
      const aiResponse = await geminiService.generateResponse(chatMessages, context);

      // Add AI response to Firestore
      await conversationService.addMessage(
        conversationId,
        aiResponse,
        'assistant',
        {
          aiModel: 'gemini-2.0-flash',
          topics: messageAnalysis.topics
        }
      );

    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleSendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p>Please log in to use the AI Assistant.</p>
            <Button onClick={onClose} className="mt-4">Close</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl">
        <CardHeader className="border-b bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              AI Coding Mentor
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <Badge className="bg-white/20 text-white w-fit">
            ✨ Powered by Gemini AI
          </Badge>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
          {/* Error Alert */}
          {error && (
            <Alert className="m-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-700">
                {error}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setError(null)}
                  className="ml-2 h-6 px-2 text-red-700 hover:bg-red-100"
                >
                  Dismiss
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {!isInitialized ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-gray-500">Initializing AI Assistant...</p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
                          : 'bg-gray-200'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-gray-600" />
                        )}
                      </div>
                      
                      {/* Message */}
                      <div
                        className={`p-4 rounded-lg shadow-sm ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                            : 'bg-white border border-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="prose prose-sm max-w-none">
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        </div>
                        <p className={`text-xs mt-2 ${
                          message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex gap-2 max-w-[80%]">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="bg-white border border-gray-100 text-gray-800 p-4 rounded-lg shadow-sm">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions - show only if there's just the welcome message */}
          {messages.length === 1 && !isLoading && (
            <div className="p-4 border-t bg-gray-50">
              <p className="text-sm text-gray-600 mb-3">Quick suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {quickSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(suggestion.text)}
                    className="text-xs"
                    disabled={isLoading}
                  >
                    <suggestion.icon className="w-3 h-3 mr-1" />
                    {suggestion.text}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t bg-gray-50">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about coding..."
                className="flex-1 bg-white shadow-sm border-gray-200 focus-visible:ring-purple-500"
                disabled={isLoading || !isInitialized}
              />
              <Button
                type="submit"
                disabled={!inputValue.trim() || isLoading || !isInitialized}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;
