// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7viifv2hVZenTc7FX2f_fhusrMb_QbEg",
  authDomain: "morleys-restaurant.firebaseapp.com",
  projectId: "morleys-restaurant",
  storageBucket: "morleys-restaurant.firebasestorage.app",
  messagingSenderId: "430306650328",
  appId: "1:430306650328:web:ecfe9f04bf7b9d17154fad",
  measurementId: "G-JF16BTQ2Q9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export auth so we can use it in other scripts
window.auth = auth;
window.firebaseFns = {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
};