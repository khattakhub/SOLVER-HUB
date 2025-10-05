import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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
let auth;
let db;


if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  try {
    // Check if app is already initialized to avoid errors during hot-reloading
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    // Initialize Analytics only if supported by the browser
    isSupported().then(supported => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
  } catch (error)
 {
    console.error("Firebase initialization failed:", error);
  }
} else {
    console.warn("Firebase configuration is incomplete. Firebase features will be disabled.");
}

export { app, analytics, auth, db };
