// REFACTORED to use Firebase v9 modular SDK to align with import maps and modern practices.
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported, Analytics } from "firebase/analytics";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

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

// Initialize Firebase
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let analytics: Analytics | undefined;

try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    isAnalyticsSupported().then(supported => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    });

  } else {
      console.warn("Firebase configuration is incomplete. Firebase features are disabled.");
  }
} catch (error) {
  console.error("Firebase core initialization failed:", error);
}


export { app, analytics, auth, db };
