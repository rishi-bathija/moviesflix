// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDECuMbPwXe3eJUgGefGv8ZrX4cdDV548U",
  authDomain: "moviesflixgpt.firebaseapp.com",
  projectId: "moviesflixgpt",
  storageBucket: "moviesflixgpt.appspot.com",
  messagingSenderId: "527689813546",
  appId: "1:527689813546:web:88db7a5302920e9898bd53",
  measurementId: "G-9HSSNH4178"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();