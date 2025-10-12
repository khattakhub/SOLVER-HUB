import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// --- IMPORTANT FOR DEPLOYMENT ---
// The configuration object below, which you provided, is for your reference.
// DO NOT UNCOMMENT THIS BLOCK. Hardcoding credentials is a major security risk as they
// become publicly visible.
//
// You MUST set these values as Environment Variables on your deployment platform (e.g., Vercel).
// The variable names you need to use are listed in the comments.
/*
const firebaseConfigReference = {
  apiKey: "AIzaSyCnl9H7GXK_aIXiOyTxmMAEEfPcq_EH28s",           // Environment Variable Name: VITE_FIREBASE_API_KEY
  authDomain: "problem-solver-hub-by-shahzad.firebaseapp.com", // Environment Variable Name: VITE_FIREBASE_AUTH_DOMAIN
  projectId: "problem-solver-hub-by-shahzad",                  // Environment Variable Name: VITE_FIREBASE_PROJECT_ID
  storageBucket: "problem-solver-hub-by-shahzad.firebasestorage.app",  // Environment Variable Name: VITE_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "163021811851",                           // Environment Variable Name: VITE_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:163021811851:web:ace0b2f234ca2384a6e48e",         // Environment Variable Name: VITE_FIREBASE_APP_ID
  measurementId: "G-1DG8JKP6BP"                                // Environment Variable Name: VITE_FIREBASE_MEASUREMENT_ID
};
*/

// Your web app's Firebase configuration is loaded from environment variables.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase and export its status
let app;
let analytics;
let auth;
let db;
let isFirebaseInitialized = false;

if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    isFirebaseInitialized = true;
    isSupported().then(supported => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
  } catch (error)
 {
    console.error("Firebase initialization failed:", error);
    isFirebaseInitialized = false;
  }
} else {
    console.warn("Firebase configuration is incomplete. Firebase features will be disabled. Ensure all VITE_FIREBASE_ environment variables are set in your deployment environment.");
}

export { app, analytics, auth, db, isFirebaseInitialized };