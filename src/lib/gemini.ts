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
  
  // Shortened, more efficient system prompt
  private readonly SYSTEM_PROMPT = `You are CompanAI's AI coding mentor helping beginners learn through real projects. Be encouraging, provide step-by-step guidance, and suggest tools like Lovable.dev, Cursor, and Firebase. Keep responses conversational and include code examples when helpful.`;

  // Streaming response method for better UX
  async generateStreamingResponse(
    messages: ChatMessage[],
    context?: ConversationContext,
    currentUserMessage?: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    try {
      // Messages are already limited to 10 by the sliding window system
      const chatHistory = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.parts }]
      }));

      // Ensure chat history starts with a user message
      if (chatHistory.length > 0 && chatHistory[0].role === 'model') {
        // Remove first model message if it starts with one
        chatHistory.shift();
      }

      // If no messages or empty history, start with a simple user greeting
      if (chatHistory.length === 0) {
        chatHistory.push({
          role: 'user',
          parts: [{ text: 'Hello, I need help with coding.' }]
        });
      }

      // Start chat with properly formatted history
      const chat = this.model.startChat({
        history: chatHistory,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.8,
          maxOutputTokens: 1000,
        },
      });

      // Use the current user message if provided, otherwise get from messages array
      let messageToSend = currentUserMessage || messages[messages.length - 1]?.parts;
      
      if (!messageToSend) {
        throw new Error('No message to send');
      }

      // Add context to the user message if available
      if (context) {
        let contextSuffix = '';
        if (context.currentProject) {
          contextSuffix += `\n\n[Context: Currently working on project "${context.currentProject}"]`;
        }
        if (context.skillLevel) {
          contextSuffix += `\n[My skill level: ${context.skillLevel}]`;
        }
        if (contextSuffix) {
          messageToSend = messageToSend + contextSuffix;
        }
      }

      // Add system guidance to the first message if this is a new conversation
      if (chatHistory.length <= 1) {
        messageToSend = `${this.SYSTEM_PROMPT}\n\nUser question: ${messageToSend}`;
      }
      
      // Use streaming for immediate feedback
      const result = await chat.sendMessageStream(messageToSend);
      
      let fullResponse = '';
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;
        onChunk?.(chunkText); // Stream chunks to UI
      }
      
      return fullResponse;
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw new Error('Failed to generate response. Please try again.');
    }
  }

  // Keep the original method for non-streaming use cases
  async generateResponse(
    messages: ChatMessage[],
    context?: ConversationContext
  ): Promise<string> {
    return this.generateStreamingResponse(messages, context);
  }

  // Simplified message analysis (optional - can be removed to eliminate dual API calls)
  analyzeUserMessageSync(message: string): {
    intent: 'question' | 'help_request' | 'project_idea' | 'debug_help' | 'general';
    topics: string[];
    urgency: 'low' | 'medium' | 'high';
  } {
    // Simple regex-based analysis instead of API call
    const lowerMessage = message.toLowerCase();
    
    let intent: 'question' | 'help_request' | 'project_idea' | 'debug_help' | 'general' = 'general';
    if (lowerMessage.includes('help') || lowerMessage.includes('how to')) {
      intent = 'help_request';
    } else if (lowerMessage.includes('?')) {
      intent = 'question';
    } else if (lowerMessage.includes('error') || lowerMessage.includes('bug')) {
      intent = 'debug_help';
    } else if (lowerMessage.includes('project') || lowerMessage.includes('app') || lowerMessage.includes('build')) {
      intent = 'project_idea';
    }

    // Extract topics using simple keyword matching
    const topics: string[] = [];
    const techKeywords = ['react', 'javascript', 'python', 'css', 'html', 'firebase', 'api', 'database'];
    techKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) {
        topics.push(keyword);
      }
    });

    const urgency = lowerMessage.includes('urgent') || lowerMessage.includes('asap') ? 'high' : 'medium';

    return { intent, topics, urgency };
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

  async generateRefinedPrompt(
    selectedIdea: any,
    customization: {
      colorScheme: string
      layoutStyle: string
      fontVibe: string
      features: string[]
      customFeatures: string
      userFlow: string
      customHexColor?: string
    }
  ): Promise<string> {
    try {
      const colorInfo = customization.colorScheme === 'custom' 
        ? `Custom color: ${customization.customHexColor}`
        : customization.colorScheme.replace('-', ' ');

      const prompt = `You are an expert technical architect. Based on the selected app idea and user customizations, generate comprehensive development prompts for both Lovable.dev (frontend) and Cursor (backend).

SELECTED APP IDEA:
${JSON.stringify(selectedIdea, null, 2)}

USER CUSTOMIZATIONS:
- Color Scheme: ${colorInfo}
- Layout Style: ${customization.layoutStyle}
- Font Style: ${customization.fontVibe}
- Selected Features: ${customization.features.join(', ')}
- Custom Features: ${customization.customFeatures}
- User Flow: ${customization.userFlow}

Generate two detailed prompts:

1. **LOVABLE.DEV PROMPT** (Frontend):
Include specific:
- Component structure based on layout style
- Color scheme implementation (CSS variables, Tailwind classes)
- Typography choices based on font vibe
- Feature-specific UI components
- User flow implementation
- Responsive design considerations

2. **CURSOR PROMPT** (Backend):
Include specific:
- Database schema for selected features
- API endpoints needed
- Authentication setup (if selected)
- Feature-specific backend logic
- Integration points with frontend

Format the response as:

## LOVABLE.DEV PROMPT
[Detailed frontend prompt here]

## CURSOR PROMPT  
[Detailed backend prompt here]

Make sure both prompts are comprehensive and actionable for AI tools to execute.`;

      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.8,
          maxOutputTokens: 4000,
        },
      });
      
      return result.response.text();
    } catch (error) {
      console.error('Error generating refined prompt:', error);
      throw new Error('Failed to generate refined prompts. Please try again.');
    }
  }
}

export const geminiService = new GeminiService(); 