import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  getDocs,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { User } from '@/lib/auth';

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Timestamp;
  metadata?: {
    intent?: string;
    topics?: string[];
    aiModel?: string;
  };
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  lastMessage: string;
  lastActivity: Timestamp;
  messageCount: number;
  context?: {
    userProgress?: string;
    currentProject?: string;
    skillLevel?: 'beginner' | 'intermediate' | 'advanced';
    lastTopics?: string[];
  };
  createdAt: Timestamp;
}

export class ConversationService {
  // Create a new conversation
  async createConversation(
    user: User, 
    title: string = 'New Conversation'
  ): Promise<string> {
    try {
      const conversationData = {
        userId: user.id,
        title,
        lastMessage: '',
        lastActivity: serverTimestamp(),
        messageCount: 0,
        context: {
          skillLevel: (user.progress?.level?.toLowerCase() as 'beginner' | 'intermediate' | 'advanced') || 'beginner',
          lastTopics: []
        },
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'conversations'), conversationData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  // Add a message to a conversation
  async addMessage(
    conversationId: string,
    content: string,
    role: 'user' | 'assistant',
    metadata?: { intent?: string; topics?: string[]; aiModel?: string }
  ): Promise<string> {
    try {
      // Add message to messages subcollection
      const messageData = {
        conversationId,
        content,
        role,
        timestamp: serverTimestamp(),
        metadata: metadata || {}
      };

      const messagesRef = collection(db, 'conversations', conversationId, 'messages');
      const messageDoc = await addDoc(messagesRef, messageData);

      // Update conversation metadata
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        lastMessage: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
        lastActivity: serverTimestamp(),
        messageCount: await this.getMessageCount(conversationId) + 1
      });

      // Update conversation context if it's a user message
      if (role === 'user' && metadata?.topics) {
        await this.updateConversationContext(conversationId, {
          lastTopics: metadata.topics
        });
      }

      return messageDoc.id;
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  }

  // Get messages for a conversation with real-time updates
  subscribeToMessages(
    conversationId: string,
    callback: (messages: Message[]) => void
  ): () => void {
    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    return onSnapshot(q, (snapshot) => {
      const messages: Message[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Message));
      callback(messages);
    });
  }

  // Get user's conversations
  async getUserConversations(userId: string): Promise<Conversation[]> {
    try {
      const conversationsRef = collection(db, 'conversations');
      const q = query(
        conversationsRef,
        where('userId', '==', userId),
        orderBy('lastActivity', 'desc'),
        limit(20)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Conversation));
    } catch (error) {
      console.error('Error getting conversations:', error);
      throw error;
    }
  }

  // Subscribe to user's conversations with real-time updates
  subscribeToUserConversations(
    userId: string,
    callback: (conversations: Conversation[]) => void
  ): () => void {
    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where('userId', '==', userId),
      orderBy('lastActivity', 'desc'),
      limit(20)
    );

    return onSnapshot(q, (snapshot) => {
      const conversations: Conversation[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Conversation));
      callback(conversations);
    });
  }

  // Get recent messages for context (last 10 messages)
  async getRecentMessagesForContext(conversationId: string): Promise<Message[]> {
    try {
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');
      const q = query(
        messagesRef,
        orderBy('timestamp', 'desc'),
        limit(10)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Message))
        .reverse(); // Reverse to get chronological order
    } catch (error) {
      console.error('Error getting recent messages:', error);
      return [];
    }
  }

  // Update conversation context
  async updateConversationContext(
    conversationId: string,
    contextUpdate: Partial<Conversation['context']>
  ): Promise<void> {
    try {
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        [`context.${Object.keys(contextUpdate)[0]}`]: Object.values(contextUpdate)[0]
      });
    } catch (error) {
      console.error('Error updating conversation context:', error);
      throw error;
    }
  }

  // Get conversation by ID
  async getConversation(conversationId: string): Promise<Conversation | null> {
    try {
      const conversationsRef = collection(db, 'conversations');
      const q = query(conversationsRef, where('__name__', '==', conversationId));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) return null;
      
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Conversation;
    } catch (error) {
      console.error('Error getting conversation:', error);
      return null;
    }
  }

  // Helper method to get message count
  private async getMessageCount(conversationId: string): Promise<number> {
    try {
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');
      const snapshot = await getDocs(messagesRef);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting message count:', error);
      return 0;
    }
  }

  // Update conversation title based on first message
  async updateConversationTitle(conversationId: string, firstMessage: string): Promise<void> {
    try {
      const title = firstMessage.length > 50 
        ? firstMessage.substring(0, 47) + '...'
        : firstMessage;
      
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, { title });
    } catch (error) {
      console.error('Error updating conversation title:', error);
    }
  }
}

export const conversationService = new ConversationService(); 