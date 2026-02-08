// ============================================
// FIREBASE CONFIGURATION
// ============================================

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase config
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDEw5sL6fTrLfY849FaRJ4YB5V27gvmIh4",
  authDomain: "anna-s-website.firebaseapp.com",
  projectId: "anna-s-website",
  storageBucket: "anna-s-website.firebasestorage.app",
  messagingSenderId: "525285664619",
  appId: "1:525285664619:web:337573c906f624e85f4e2e",
  measurementId: "G-9ZLWZMWCNE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
