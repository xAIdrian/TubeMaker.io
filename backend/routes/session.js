// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const express = require('express');
const router = express.Router();

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBp9LjyyZYGtbRYGnYUEO0ex4fM0_ghJqw",
  authDomain: "freeadmingptwebapp.firebaseapp.com",
  databaseURL: "https://freeadmingptwebapp-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "freeadmingptwebapp",
  storageBucket: "freeadmingptwebapp.appspot.com",
  messagingSenderId: "747467278125",
  appId: "1:747467278125:web:7c77769cc10bd84892f5a4",
  measurementId: "G-SQD6B5Q7LC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

module.exports = router;