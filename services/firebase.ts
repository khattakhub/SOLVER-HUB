// FIX: Reverted Firebase initialization to v8 compatibility syntax. The v9 modular syntax was causing an import error,
// which indicates that the installed Firebase SDK version is v8.
import firebase from "firebase/app";
import "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnl9H7GXK_aIXiOyTxmMAEEfPcq_EH28s",
  authDomain: "problem-solver-hub-by-shahzad.firebaseapp.com",
  projectId: "problem-solver-hub-by-shahzad",
  storageBucket: "problem-solver-hub-by-shahzad.firebasestorage.app",
  messagingSenderId: "163021811851",
  appId: "1:163021811851:web:ace0b2f234ca2384a6e48e",
  measurementId: "G-1DG8JKP6BP"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();

export { app, analytics };
