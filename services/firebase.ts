import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration is now loaded from environment variables
const firebaseConfig = {
  FIREBASE_API_KEY=AIzaSyCnl9H7GXK_aIXiOyTxmMAEEfPcq_EH28s
FIREBASE_AUTH_DOMAIN=problem-solver-hub-by-shahzad.firebaseapp.com
FIREBASE_PROJECT_ID=problem-solver-hub-by-shahzad
FIREBASE_STORAGE_BUCKET=problem-solver-hub-by-shahzad.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=163021811851
FIREBASE_APP_ID=1:163021811851:web:ace0b2f234ca2384a6e48e
FIREBASE_MEASUREMENT_ID=G-1DG8JKP6BP
};

// Initialize Firebase only if the essential configuration is provided to prevent errors.
let app;
let analytics;
let auth;
let db;

if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  try {
    app = initializeApp(firebaseConfig);
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