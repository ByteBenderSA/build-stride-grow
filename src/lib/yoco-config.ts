// Yoco Payment Configuration
export const yocoConfig = {
  // Test API keys (replace with live keys in production)
  publicKey: 'pk_live_7b6fb859Dm1X77Ge0304',
  secretKey: 'sk_live_99758b8aGVAMqqr8e4740b9871fa', // Only use in backend
  
  // API endpoints
  apiUrl: 'https://online.yoco.com/v1',
  
  // Currency settings
  currency: 'ZAR',
  
  // Minimum payment amount (in cents) - Yoco minimum is R2 = 200 cents
  minAmount: 200,
  
  // Environment
  isProduction: true,
  
  // Plan pricing (in cents)
  planPricing: {
    pro: 7000,     // R70 (5 ideas, 50 chats)
    premium: 10000, // R100 (20 ideas, 100 chats)
    ultra: 10000   // R100 (monthly, unlimited)
  }
} as const;

export type YocoConfig = typeof yocoConfig; 