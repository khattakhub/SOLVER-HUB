// FIX: Switched to Firebase v9 compat libraries to resolve module resolution issues.
import firebase from "firebase/compat/app";
import "firebase/compat/analytics";

// Your web app's Firebase configuration is now loaded from environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase only if the essential configuration is provided to prevent errors.
let app;
let analytics;

if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  try {
    app = firebase.initializeApp(firebaseConfig);
    analytics = firebase.analytics();
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
} else {
    console.warn("Firebase configuration is incomplete. Analytics and other Firebase features may be disabled.");
}

export { app, analytics };
