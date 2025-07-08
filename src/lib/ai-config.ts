import { geminiService } from './gemini';
import { deepseekService } from './deepseek';

// Export both services for specific use cases
export { geminiService } from './gemini';
export { deepseekService } from './deepseek';

// Specific routing:
// - IdeaWorkshop & Workspace: use geminiService  
// - AI Assistant (chat): use deepseekService

// Export types for consistency
export type { ChatMessage, ConversationContext } from './gemini';

// For backward compatibility, keep the old aiService export pointing to gemini
// (in case any components still use it)
export const aiService = geminiService;
export const currentProvider = 'gemini'; 