// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDSNInQpcoBPWsI2hqZzSUtuQr8EnbhSAk",
  authDomain: "myexpensetracker-5215d.firebaseapp.com",
  projectId: "myexpensetracker-5215d",
  storageBucket: "myexpensetracker-5215d.firebasestorage.app",
  messagingSenderId: "35352813602",
  appId: "1:35352813602:web:dea96972ccf3eff3ffea7b",
  measurementId: "G-YFZ4Y2RPPB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// ตั้งค่า Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// ส่งออก Tool ที่เราจะใช้งาน
export const auth = getAuth(app);
export const db = getFirestore(app);
export { googleProvider };
