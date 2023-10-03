// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyAxFW9VrIoZQxLTAMHl9uIfcz3JPL-JKXA",
  authDomain: "albait-ac04e.firebaseapp.com",
  projectId: "albait-ac04e",
  storageBucket: "albait-ac04e.appspot.com",
  messagingSenderId: "846369919679",
  appId: "1:846369919679:web:f5ab05342129147c9fec0a",
  measurementId: "G-HMCXLTTVC0"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
 // Customize notification here
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    ...payload.data,
    icon: payload.data.image
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});