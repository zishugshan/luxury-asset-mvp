// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9WDeg2Q7Q0m_5PFjvXXpTVprBYY8l_LE",
  authDomain: "luxury-asset-mvp.firebaseapp.com",
  projectId: "luxury-asset-mvp",
  storageBucket: "luxury-asset-mvp.firebasestorage.app",
  messagingSenderId: "147590689877",
  appId: "1:147590689877:web:934ec8f8a745194ec550dc",
  measurementId: "G-ZBR4GJ64TS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const analytics = getAnalytics(app);

export { auth };
