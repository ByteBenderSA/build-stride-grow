import OpenAI from 'openai';

// Initialize DeepSeek AI (OpenAI-compatible)
const DEEPSEEK_API_KEY = 'sk-560bea5180c04cb286d413aac21e585c';

if (!DEEPSEEK_API_KEY) {
  throw new Error('DeepSeek API key is required. Please set DEEPSEEK_API_KEY.');
}

const deepseek = new OpenAI({
  apiKey: DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
  dangerouslyAllowBrowser: true
});

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

class DeepSeekService {
  private readonly SYSTEM_PROMPT = `You are CompanAI's AI coding mentor helping beginners learn through real projects. Be encouraging, provide step-by-step guidance, and suggest tools like Lovable.dev, Cursor, and Firebase. Keep responses conversational and include code examples when helpful.`;

  // Convert ChatMessage format to OpenAI format
  private convertMessages(messages: ChatMessage[], systemPrompt: string): OpenAI.ChatCompletionMessageParam[] {
    const openAIMessages: OpenAI.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt }
    ];

    messages.forEach(msg => {
      openAIMessages.push({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.parts
      });
    });

    return openAIMessages;
  }

  // Streaming response method for better UX
  async generateStreamingResponse(
    messages: ChatMessage[],
    context?: ConversationContext,
    currentUserMessage?: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    try {
      // Build system prompt with context
      let systemPrompt = this.SYSTEM_PROMPT;
      if (context?.currentProject) {
        systemPrompt += `\n\nCurrent Project: ${context.currentProject}`;
      }
      if (context?.skillLevel) {
        systemPrompt += `\nSkill Level: ${context.skillLevel}`;
      }

      // Convert messages to OpenAI format
      const openAIMessages = this.convertMessages(messages, systemPrompt);

      // Add current user message if provided
      if (currentUserMessage) {
        // Add context to the user message if available
        let messageWithContext = currentUserMessage;
        if (context) {
          let contextSuffix = '';
          if (context.currentProject) {
            contextSuffix += `\n\n[Context: Currently working on project "${context.currentProject}"]`;
          }
          if (context.skillLevel) {
            contextSuffix += `\n[My skill level: ${context.skillLevel}]`;
          }
          if (contextSuffix) {
            messageWithContext = currentUserMessage + contextSuffix;
          }
        }

        openAIMessages.push({
          role: 'user',
          content: messageWithContext
        });
      }

      // Create streaming response
      const stream = await deepseek.chat.completions.create({
        model: 'deepseek-chat',
        messages: openAIMessages,
        temperature: 0.7,
        max_tokens: 1000,
        stream: true,
      });

      let fullResponse = '';
      
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          fullResponse += content;
          onChunk?.(content);
        }
      }
      
      return fullResponse;
    } catch (error) {
      console.error('Error generating DeepSeek response:', error);
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

  // Simple regex-based analysis (same as Gemini version)
  analyzeUserMessageSync(message: string): {
    intent: 'question' | 'help_request' | 'project_idea' | 'debug_help' | 'general';
    topics: string[];
    urgency: 'low' | 'medium' | 'high';
  } {
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

  // Project idea generation (simplified for DeepSeek)
  async generateProjectIdea(userInput?: string, skillLevel?: string): Promise<string> {
    try {
      const prompt = `You are an expert product analyst and technical architect. Generate 3 unique project ideas based on the user's input.

User's App Vision: ${userInput || 'No specific input provided'}
Skill Level: ${skillLevel || 'Beginner'}

Create 3 distinct project variations separated by "---" in JSON format for each:
{
  "title": "[Descriptive name]",
  "description": "[2-3 sentences about the project]",
  "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5", "Feature 6"],
  "techStack": ["React", "TypeScript", "Tailwind CSS", "Firebase", "Additional tech"],
  "difficulty": "Beginner",
  "learningObjectives": ["Objective 1", "Objective 2", "Objective 3", "Objective 4"],
  "timeEstimate": "2-4 weeks",
  "marketPotential": "Medium"
}`;

      const response = await deepseek.chat.completions.create({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 3000,
      });
      
      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error generating project idea:', error);
      throw new Error('Failed to generate project idea. Please try again.');
    }
  }

  // Long form prompt generation
  async generateLongFormPrompt(prompt: string): Promise<string> {
    try {
      const response = await deepseek.chat.completions.create({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 4000,
      });
      
      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error generating long form prompt:', error);
      throw new Error('Failed to generate prompt. Please try again.');
    }
  }

  // Refined prompt generation
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

## LOVABLE.DEV PROMPT
[Detailed frontend prompt here]

## CURSOR PROMPT  
[Detailed backend prompt here]

Make sure both prompts are comprehensive and actionable for AI tools to execute.`;

      const response = await deepseek.chat.completions.create({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 4000,
      });
      
      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error generating refined prompt:', error);
      throw new Error('Failed to generate refined prompts. Please try again.');
    }
  }
}

export const deepseekService = new DeepSeekService(); 