import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC_Z3SuE9ZorF8MioIPmBJtcgqSY4SSFzY",
  authDomain: "golden-82fa5.firebaseapp.com",
  projectId: "golden-82fa5",
  storageBucket: "golden-82fa5.firebasestorage.app",
  messagingSenderId: "1069506603312",
  appId: "1:1069506603312:web:212bd0bc9941d7cde880f5",
  measurementId: "G-RGKHCRSBTR"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
