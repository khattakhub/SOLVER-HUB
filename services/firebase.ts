// FIX: Switched to Firebase v9 compat libraries to resolve module resolution issues.
import firebase from "firebase/compa/app";
import "firebase/compat/analytics";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnl9H7GXK_aIXiOyTxmMAEEfPcq_EH28s",
  authDomain: "problem-solver-hub-by-shahzad.firebaseapp.com",
  projectId: "problem-solver-hub-by-shahzad",
  storageBucket: "problem-solver-hub-by-shahzad.appspot.com",
  messagingSenderId: "163021811851",
  appId: "1:163021811851:web:ace0b2f234ca2384a6e48e",
  measurementId: "G-1DG8JKP6BP"
};

// Initialize Firebase only if the essential configuration is provided to prevent errors.
let app;
let analytics;
let auth;
let db;


if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  try {
    app = firebase.initializeApp(firebaseConfig);
    analytics = firebase.analytics();
    auth = firebase.auth();
    db = firebase.firestore();
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
} else {
    console.warn("Firebase configuration is incomplete. Analytics and other Firebase features may be disabled.");
}

export { app, analytics, auth, db };