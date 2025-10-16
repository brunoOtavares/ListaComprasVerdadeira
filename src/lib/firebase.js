// src/lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCTZHv8LiuNuNcE2Edh0TnPIXCEEZBAPOQ",
  authDomain: "lista-de-compras-b5fed.firebaseapp.com",
  projectId: "lista-de-compras-b5fed",
  storageBucket: "lista-de-compras-b5fed.appspot.com",
  messagingSenderId: "928934741826",
  appId: "1:928934741826:web:7f6b6c9c7c6c9c7c6c9c7c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
