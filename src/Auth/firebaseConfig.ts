// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAewu_4BzjD3LGSQCeQVYy4xvajWhyxvG0",
    authDomain: "openfitness-5cb8a.firebaseapp.com",
    projectId: "openfitness-5cb8a",
    storageBucket: "openfitness-5cb8a.appspot.com",
    messagingSenderId: "35116934645",
    appId: "1:35116934645:web:883554d5822d36d7456cbc"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

export { firebase };