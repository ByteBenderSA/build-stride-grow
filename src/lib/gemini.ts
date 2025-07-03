import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBeJKlD6c-_-Kcv0_UJ3cP8Vl2VgiUiaD0';

if (!API_KEY) {
  throw new Error('Gemini API key is required. Please set VITE_GEMINI_API_KEY environment variable.');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export interface ChatMessage {
  role: 'user' | 'model';
  parts: string;
}

export interface ConversationContext {
  userProgress?: string;
  currentProject?: string;
  lastTopics?: string[];
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
}

class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  private readonly SYSTEM_PROMPT = `You are an expert AI coding mentor for BuildFlow, a platform that helps complete beginners learn to code through building real projects. Your role is to:

1. **Be encouraging and supportive** - Remember users are complete beginners
2. **Provide actionable guidance** - Give specific, step-by-step instructions
3. **Focus on practical learning** - Emphasize building projects over theory
4. **Recommend tools** - Suggest Lovable.dev for rapid prototyping, Cursor for coding, Firebase for backend
5. **Be patient** - Explain concepts simply without being condescending
6. **Ask clarifying questions** - Help users narrow down their goals
7. **Provide project ideas** - Suggest beginner-friendly projects that teach important concepts

Guidelines:
- Keep responses conversational and friendly
- Use simple language and avoid jargon when possible
- If using technical terms, briefly explain them
- Provide code examples when helpful
- Suggest next steps after each interaction
- Remember the user's context and previous conversations

Current conversation context will be provided with each message.`;

  async generateResponse(
    messages: ChatMessage[],
    context?: ConversationContext
  ): Promise<string> {
    try {
      // Build context-aware prompt
      let contextPrompt = this.SYSTEM_PROMPT;
      
      if (context) {
        contextPrompt += `\n\nUser Context:`;
        if (context.skillLevel) {
          contextPrompt += `\n- Skill Level: ${context.skillLevel}`;
        }
        if (context.currentProject) {
          contextPrompt += `\n- Current Project: ${context.currentProject}`;
        }
        if (context.userProgress) {
          contextPrompt += `\n- Progress: ${context.userProgress}`;
        }
        if (context.lastTopics && context.lastTopics.length > 0) {
          contextPrompt += `\n- Recent Topics: ${context.lastTopics.join(', ')}`;
        }
      }

      // Format chat history for Gemini
      const chatHistory = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.parts }]
      }));

      // Add system prompt as the first message
      const fullHistory = [
        {
          role: 'user' as const,
          parts: [{ text: contextPrompt }]
        },
        {
          role: 'model' as const,
          parts: [{ text: 'I understand my role as your AI coding mentor. I\'m here to help you learn coding through building real projects. What would you like to work on today?' }]
        },
        ...chatHistory
      ];

      // Generate response
      const chat = this.model.startChat({
        history: fullHistory,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.8,
          maxOutputTokens: 1000,
        },
      });

      const lastMessage = messages[messages.length - 1];
      const result = await chat.sendMessage(lastMessage.parts);
      
      return result.response.text();
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw new Error('Failed to generate response. Please try again.');
    }
  }

  async generateProjectIdea(userInput?: string, skillLevel?: string): Promise<string> {
    try {
      const prompt = `You are an expert product analyst and technical architect. Your job is to take a user's app idea and create 3 unique, innovative project variations that TRULY REFLECT their specific vision.

CRITICAL INSTRUCTION: DO NOT default to common app patterns like "flashcard apps" or generic CRUD apps. Instead, deeply analyze what the user is actually trying to achieve and build on THEIR innovative concepts.

User's App Vision:
${userInput || 'No specific input provided'}

Skill Level: ${skillLevel || 'Beginner'}

ANALYSIS FRAMEWORK:
1. **Extract Core Innovation**: What makes this idea unique? What's the main value proposition?
2. **Identify Key Interactions**: How do users actually engage with the app? What's the primary experience?
3. **Technical Challenges**: What are the interesting technical aspects that make this worth building?
4. **User Journey**: Map out the specific user flows that deliver value

GENERATION RULES:
- Build 3 variations that honor the user's ACTUAL vision
- Each should be a different approach to solving the SAME core problem
- Include the innovative features they mentioned, don't simplify to basic patterns
- If they mention AI conversation, focus on conversational interfaces
- If they mention file processing, include smart content analysis
- If they mention tutoring, focus on personalized learning experiences

Return 3 ideas separated by "---" in this EXACT JSON format for each:

{
  "title": "[Specific descriptive name that reflects their vision]",
  "description": "[2-3 sentences capturing their EXACT use case and value proposition]",
  "features": [
    "[Feature 1: Specific to their idea]",
    "[Feature 2: Technical innovation they mentioned]", 
    "[Feature 3: Core user interaction they described]",
    "[Feature 4: Smart/AI feature if mentioned]",
    "[Feature 5: User management/progress tracking]",
    "[Feature 6: Advanced feature that extends their vision]"
  ],
  "techStack": [
    "React",
    "TypeScript",
    "Tailwind CSS", 
    "Firebase",
    "[AI API mentioned or similar]",
    "[Additional tech for their specific features]"
  ],
  "difficulty": "Beginner",
  "learningObjectives": [
    "[Skill directly related to their app's features]",
    "[Technical concept they'll learn from their use case]",
    "[Integration skill for their specific APIs/services]",
    "[UI/UX skill relevant to their interface]"
  ],
  "timeEstimate": "2-4 weeks",
  "marketPotential": "Medium"
}

IMPORTANT: 
- Honor their SPECIFIC vision, don't generic-ify it
- If they want conversational AI, make it conversational AI, not flashcards
- If they want file processing, include actual file processing features
- Focus on what makes THEIR idea innovative and valuable
- Each variation should be a different technical approach to their same goal

Generate 3 distinct variations now:`;

      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.9,
          maxOutputTokens: 3000,
        },
      });
      
      return result.response.text();
    } catch (error) {
      console.error('Error generating project idea:', error);
      throw new Error('Failed to generate project idea. Please try again.');
    }
  }

  async analyzeUserMessage(message: string): Promise<{
    intent: 'question' | 'help_request' | 'project_idea' | 'debug_help' | 'general';
    topics: string[];
    urgency: 'low' | 'medium' | 'high';
  }> {
    try {
      const prompt = `Analyze this user message and extract:
      1. Intent (question, help_request, project_idea, debug_help, or general)
      2. Key topics mentioned (as array)
      3. Urgency level (low, medium, high)
      
      Message: "${message}"
      
      Respond in JSON format only.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      // Parse JSON response
      try {
        return JSON.parse(response);
      } catch {
        // Fallback if JSON parsing fails
        return {
          intent: 'general' as const,
          topics: [],
          urgency: 'medium' as const
        };
      }
    } catch (error) {
      console.error('Error analyzing message:', error);
      return {
        intent: 'general' as const,
        topics: [],
        urgency: 'medium' as const
      };
    }
  }

  async generateLongFormPrompt(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.8,
          maxOutputTokens: 4000, // Higher limit for long prompts
        },
      });
      
      return result.response.text();
    } catch (error) {
      console.error('Error generating long form prompt:', error);
      throw new Error('Failed to generate prompt. Please try again.');
    }
  }
}

export const geminiService = new GeminiService(); 