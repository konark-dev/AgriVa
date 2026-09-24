import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration using Vite environment variables with fallback keys
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDWzSi4mhwLdqKbu60cNpC9diteLSVzuE0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "agriva-7b01d.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "agriva-7b01d",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "agriva-7b01d.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "717856115911",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:717856115911:web:380850fd146be40e1382e2",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-BM7VRZSWER"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
let analytics = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (err) {
    console.warn("[Firebase Analytics] init skipped:", err?.message);
  }
}
export { analytics };

export default app;
