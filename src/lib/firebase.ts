import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBf0QCU97rnl8g-l2YBiOGJI4pX9DyMmyI",
  authDomain: "online-shop-62c2b.firebaseapp.com",
  projectId: "online-shop-62c2b",
  storageBucket: "online-shop-62c2b.firebasestorage.app",
  messagingSenderId: "227568608574",
  appId: "1:227568608574:web:29723acd88c0d6dae8786f",
  measurementId: "G-WBRZBRJPYX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);

// Auth providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app; 