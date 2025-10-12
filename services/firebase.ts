// FIX: The project appears to be using Firebase v8 SDK with a v9+ package.
// The imports have been changed to use the v8 compatibility layer.
import firebase from "firebase/compat/app";
import "firebase/compat/analytics";
import "firebase/compat/auth";
import "firebase/compat/firestore";

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
    app = firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    // Initialize Analytics only if supported by the browser
    firebase.analytics.isSupported().then(supported => {
        if (supported) {
            analytics = firebase.analytics();
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