// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC17acCDdgON6PPXT8uYtVFhXZT8_4dwcM",
  authDomain: "swapit-9763e.firebaseapp.com",
  projectId: "swapit-9763e",
  storageBucket: "swapit-9763e.appspot.com",
  messagingSenderId: "475991489514",
  appId: "1:475991489514:web:6ce85f1e411ca0f583d093",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
