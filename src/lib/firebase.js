// src/lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB8O60X4lA4gacVUZtgbzhaYQLVnwqr6EU",
  authDomain: "lista-de-compras-b5fed.firebaseapp.com",
  projectId: "lista-de-compras-b5fed",
  storageBucket: "lista-de-compras-b5fed.appspot.com",
  messagingSenderId: "928934741826",
  appId: "1:928934741826:web:7f6b6c9c7c6c9c7c6c9c7c"
};

// Initialize Firebase with error handling
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw error;
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;