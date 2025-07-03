import { auth, db } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// Simple test function
export const testFirebaseConnection = async () => {
  try {
    console.log('🔍 Testing Firebase connection...');
    console.log('Auth instance:', auth);
    console.log('DB instance:', db);
    console.log('Auth app:', auth.app);
    console.log('Project ID:', auth.app.options.projectId);
    
    return {
      success: true,
      projectId: auth.app.options.projectId,
      authDomain: auth.app.options.authDomain
    };
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error);
    return {
      success: false,
      error: error
    };
  }
};

// Test simple auth call
export const testSimpleAuth = async (email: string, password: string) => {
  try {
    console.log('🔍 Testing simple auth call...');
    const result = await createUserWithEmailAndPassword(auth, email, password);
    console.log('✅ Auth success:', result);
    return { success: true, user: result.user };
  } catch (error: any) {
    console.error('❌ Auth failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    return { 
      success: false, 
      error: error.code,
      message: error.message 
    };
  }
}; 