import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCzy-PL_Sz9I5X2m7DqiNwbwUOLpkyz-Iw",
  authDomain: "debugging-learning-app.firebaseapp.com",
  projectId: "debugging-learning-app",
  storageBucket: "debugging-learning-app.firebasestorage.app",
  messagingSenderId: "680972231587",
  appId: "1:680972231587:web:12391a8b26259de6e0f016"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
