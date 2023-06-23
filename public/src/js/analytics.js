// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCb6gZkcRNQFQA00cq3FteT-uspfuCuDMQ",
    authDomain: "great-anaphylaxis.firebaseapp.com",
    projectId: "great-anaphylaxis",
    storageBucket: "great-anaphylaxis.appspot.com",
    messagingSenderId: "378487411731",
    appId: "1:378487411731:web:d0423786cef8947ff85be6",
    measurementId: "G-S7N9B0J61K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const log = logEvent;