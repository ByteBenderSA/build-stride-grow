import { GoogleGenerativeAI } from '@google/generative-ai';
import { defineSecret } from 'firebase-functions/params';

// Secret is set with: firebase functions:secrets:set GEMINI_KEY
export const GEMINI_KEY = defineSecret('GEMINI_KEY');

export const getGeminiClient = () => {
  const key = GEMINI_KEY.value();
  if (!key) {
    throw new Error(
      'GEMINI_KEY secret is not set. Run: firebase functions:secrets:set GEMINI_KEY'
    );
  }
  return new GoogleGenerativeAI(key);
};
