// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { onMessage as onMessageEvent, getMessaging as firebaseGetMessaging, getToken as firebaseGetToken } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAxFW9VrIoZQxLTAMHl9uIfcz3JPL-JKXA",
    authDomain: "albait-ac04e.firebaseapp.com",
    projectId: "albait-ac04e",
    storageBucket: "albait-ac04e.appspot.com",
    messagingSenderId: "846369919679",
    appId: "1:846369919679:web:f5ab05342129147c9fec0a",
    measurementId: "G-HMCXLTTVC0"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const getMessaging = firebaseGetMessaging(app);

export const getToken = firebaseGetToken;

export const onMessage = onMessageEvent;