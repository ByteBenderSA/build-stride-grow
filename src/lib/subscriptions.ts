import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { User } from './auth';

// Helper function to remove undefined values from objects
const removeUndefinedValues = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  
  const cleaned: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (typeof value === 'object' && value !== null) {
        cleaned[key] = removeUndefinedValues(value);
      } else {
        cleaned[key] = value;
      }
    }
  }
  return cleaned;
};

export type SubscriptionPlan = 'free' | 'pro' | 'premium' | 'ultra';

export interface SubscriptionStatus {
  plan: SubscriptionPlan;
  status: 'active' | 'expired' | 'cancelled';
  createdAt: string;
  expiresAt?: string; // For monthly subscriptions
  purchaseDate?: string; // For one-time purchases
  paddleSubscriptionId?: string;
  paddleCustomerId?: string;
  // Yoco payment data
  paymentMethod?: 'paddle' | 'yoco';
  yocoPaymentId?: string;
  yocoTransactionId?: string;
  amount?: number;
  currency?: string;
}

export interface UsageLimits {
  ideas: number;
  aiInteractions: number;
  unlimited: boolean;
}

export interface UsageStats {
  ideasGenerated: number;
  aiCallsUsed: number;
  lastResetDate: string; // For monthly resets
  currentPeriodStart: string;
}

// Plan limits configuration
export const PLAN_LIMITS: Record<SubscriptionPlan, UsageLimits> = {
  free: {
    ideas: 1,
    aiInteractions: 5,
    unlimited: false
  },
  pro: {
    ideas: 5,
    aiInteractions: 50,
    unlimited: false
  },
  premium: {
    ideas: 20,
    aiInteractions: 100,
    unlimited: false
  },
  ultra: {
    ideas: 0, // Unlimited
    aiInteractions: 0, // Unlimited
    unlimited: true
  }
};

// Get user's current subscription
export const getUserSubscription = async (userId: string): Promise<SubscriptionStatus | null> => {
  try {
    // Guard against undefined userId
    if (!userId || typeof userId !== 'string') {
      console.warn('getUserSubscription called with invalid userId:', userId);
      return null;
    }

    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) return null;
    
    const userData = userSnap.data() as User & { subscription?: SubscriptionStatus };
    
    if (!userData.subscription) {
      // Initialize with free plan
      const freeSubscription: SubscriptionStatus = {
        plan: 'free',
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      await updateDoc(userRef, {
        subscription: freeSubscription
      });
      
      return freeSubscription;
    }
    
    return userData.subscription;
  } catch (error) {
    console.error('Error getting user subscription:', error);
    return null;
  }
};

// Update user subscription
export const updateUserSubscription = async (
  userId: string, 
  subscription: SubscriptionStatus
): Promise<void> => {
  try {
    // Guard against undefined userId
    if (!userId || typeof userId !== 'string') {
      console.warn('updateUserSubscription called with invalid userId:', userId);
      throw new Error('Invalid user ID provided');
    }

    const userRef = doc(db, 'users', userId);
    
    // Clean the subscription object to remove undefined values
    const cleanedSubscription = removeUndefinedValues(subscription);
    
    await updateDoc(userRef, {
      subscription: cleanedSubscription,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user subscription:', error);
    throw error;
  }
};

// Get user's usage stats with proper period handling
export const getUserUsageStats = async (userId: string): Promise<UsageStats> => {
  try {
    // Guard against undefined userId
    if (!userId || typeof userId !== 'string') {
      console.warn('getUserUsageStats called with invalid userId:', userId);
      throw new Error('Invalid user ID provided');
    }

    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      throw new Error('User not found');
    }
    
    const userData = userSnap.data() as User;
    const subscription = await getUserSubscription(userId);
    
    if (!userData.usageStats) {
      // Initialize usage stats
      const initialStats: UsageStats = {
        ideasGenerated: 0,
        aiCallsUsed: 0,
        lastResetDate: new Date().toISOString(),
        currentPeriodStart: new Date().toISOString()
      };
      
      await updateDoc(userRef, {
        usageStats: removeUndefinedValues(initialStats)
      });
      
      return initialStats;
    }
    
    const stats = userData.usageStats as UsageStats;
    
    // Check if we need to reset monthly usage (for free tier)
    if (subscription?.plan === 'free') {
      const lastReset = new Date(stats.lastResetDate || stats.currentPeriodStart);
      const now = new Date();
      const daysSinceReset = Math.floor((now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceReset >= 30) {
        // Reset monthly usage
        const resetStats: UsageStats = {
          ideasGenerated: 0,
          aiCallsUsed: 0,
          lastResetDate: now.toISOString(),
          currentPeriodStart: now.toISOString()
        };
        
        await updateDoc(userRef, {
          usageStats: removeUndefinedValues(resetStats)
        });
        
        return resetStats;
      }
    }
    
    return stats;
  } catch (error) {
    console.error('Error getting user usage stats:', error);
    throw error;
  }
};

// Check if user can perform an action
export const checkUsageLimit = async (
  userId: string, 
  type: 'idea' | 'ai'
): Promise<{ canUse: boolean; currentUsage: number; limit: number; plan: SubscriptionPlan }> => {
  try {
    const subscription = await getUserSubscription(userId);
    const usageStats = await getUserUsageStats(userId);
    
    if (!subscription) {
      throw new Error('No subscription found');
    }
    
    const limits = PLAN_LIMITS[subscription.plan];
    
    // Ultra plan has unlimited access
    if (limits.unlimited) {
      return {
        canUse: true,
        currentUsage: type === 'idea' ? usageStats.ideasGenerated : usageStats.aiCallsUsed,
        limit: -1, // Unlimited
        plan: subscription.plan
      };
    }
    
    const currentUsage = type === 'idea' ? usageStats.ideasGenerated : usageStats.aiCallsUsed;
    const limit = type === 'idea' ? limits.ideas : limits.aiInteractions;
    
    return {
      canUse: currentUsage < limit,
      currentUsage,
      limit,
      plan: subscription.plan
    };
  } catch (error) {
    console.error('Error checking usage limit:', error);
    return {
      canUse: false,
      currentUsage: 0,
      limit: 0,
      plan: 'free'
    };
  }
};

// Increment usage counter
export const incrementUsage = async (
  userId: string,
  type: 'idea' | 'ai'
): Promise<boolean> => {
  try {
    const limitCheck = await checkUsageLimit(userId, type);
    
    if (!limitCheck.canUse) {
      return false;
    }
    
    const userRef = doc(db, 'users', userId);
    const field = type === 'idea' ? 'ideasGenerated' : 'aiCallsUsed';
    
    const currentStats = await getUserUsageStats(userId);
    const newStats = {
      ...currentStats,
      [field]: currentStats[field] + 1
    };
    
    await updateDoc(userRef, {
      usageStats: removeUndefinedValues(newStats)
    });
    
    return true;
  } catch (error) {
    console.error('Error incrementing usage:', error);
    return false;
  }
};

// Get plan features for display
export const getPlanFeatures = (plan: SubscriptionPlan) => {
  const limits = PLAN_LIMITS[plan];
  
  return {
    name: plan.charAt(0).toUpperCase() + plan.slice(1),
    ideas: limits.unlimited ? 'Unlimited' : `${limits.ideas} per ${plan === 'free' ? 'month' : 'lifetime'}`,
    aiInteractions: limits.unlimited ? 'Unlimited' : `${limits.aiInteractions} per ${plan === 'free' ? 'month' : 'lifetime'}`,
    price: plan === 'free' ? 'Free' : 
           plan === 'pro' ? 'R70 one-time' : 
           plan === 'premium' ? 'R100 one-time' : 
           'R100/month',
    unlimited: limits.unlimited
  };
};

// Check if subscription is active
export const isSubscriptionActive = (subscription: SubscriptionStatus): boolean => {
  if (subscription.status !== 'active') return false;
  
  // Free plan is always active
  if (subscription.plan === 'free') return true;
  
  // Pro and Premium plans (one-time payment) are always active once purchased
  if (subscription.plan === 'pro' || subscription.plan === 'premium') return true;
  
  // Ultra plan (monthly) - check expiration
  if (subscription.plan === 'ultra' && subscription.expiresAt) {
    return new Date(subscription.expiresAt) > new Date();
  }
  
  return true;
};

// Upgrade user to a plan
export const upgradeUserPlan = async (
  userId: string,
  newPlan: SubscriptionPlan,
  paymentData?: {
    // Paddle data
    paddleSubscriptionId?: string;
    paddleCustomerId?: string;
    paddleTransactionId?: string;
    // Yoco data
    yocoPaymentId?: string;
    yocoTransactionId?: string;
    paymentMethod?: 'paddle' | 'yoco';
    amount?: number;
    currency?: string;
  }
): Promise<void> => {
  try {
    const now = new Date().toISOString();
    const subscription: SubscriptionStatus = {
      plan: newPlan,
      status: 'active',
      createdAt: now,
      purchaseDate: now,
      paymentMethod: paymentData?.paymentMethod || 'paddle',
      // Paddle data
      paddleSubscriptionId: paymentData?.paddleSubscriptionId,
      paddleCustomerId: paymentData?.paddleCustomerId,
      // Yoco data
      yocoPaymentId: paymentData?.yocoPaymentId,
      yocoTransactionId: paymentData?.yocoTransactionId,
      amount: paymentData?.amount,
      currency: paymentData?.currency
    };
    
    // Set expiration for monthly plans
    if (newPlan === 'ultra') {
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 1);
      subscription.expiresAt = expirationDate.toISOString();
    }
    
    await updateUserSubscription(userId, subscription);
    
    // Reset usage stats when upgrading
    const userRef = doc(db, 'users', userId);
    const newUsageStats = {
      ideasGenerated: 0,
      aiCallsUsed: 0,
      lastResetDate: new Date().toISOString(),
      currentPeriodStart: new Date().toISOString()
    };
    
    await updateDoc(userRef, {
      usageStats: removeUndefinedValues(newUsageStats)
    });
  } catch (error) {
    console.error('Error upgrading user plan:', error);
    throw error;
  }
};

// Upgrade user plan with Yoco payment
export const upgradeUserPlanWithYoco = async (
  userId: string,
  planType: SubscriptionPlan,
  yocoData: {
    paymentId: string;
    transactionId?: string;
    amount: number;
    currency: string;
  }
): Promise<void> => {
  try {
    await upgradeUserPlan(userId, planType, {
      paymentMethod: 'yoco',
      yocoPaymentId: yocoData.paymentId,
      yocoTransactionId: yocoData.transactionId,
      amount: yocoData.amount,
      currency: yocoData.currency
    });
  } catch (error) {
    console.error('Error upgrading user plan with Yoco:', error);
    throw error;
  }
}; 