import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";




// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBAOvHUrFFqnOvr-zQFyDYJ7ino_YYxQVg",
  authDomain: "montagem-moveis-eabb5.firebaseapp.com",
  projectId: "montagem-moveis-eabb5",
  storageBucket: "montagem-moveis-eabb5.firebasestorage.app",
  messagingSenderId: "805852003949",
  appId: "1:805852003949:web:3a43a6e238f53d4ca38964"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


export default app;
