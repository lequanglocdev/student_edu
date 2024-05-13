// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-93075.firebaseapp.com",
  projectId: "blog-93075",
  storageBucket: "blog-93075.appspot.com",
  messagingSenderId: "967629817550",
  appId: "1:967629817550:web:7ce07166697800031c329f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);