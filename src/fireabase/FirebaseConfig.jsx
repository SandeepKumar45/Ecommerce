// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8tKaJuM-FekaZ2ZtuhjuGdGrIpbb3gT8",
  authDomain: "ecommerce-app-7f44e.firebaseapp.com",
  projectId: "ecommerce-app-7f44e",
  storageBucket: "ecommerce-app-7f44e.appspot.com",
  messagingSenderId: "664382557599",
  appId: "1:664382557599:web:66d5cfd0b0d6ab392541aa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const fireDB = getFirestore(app);
const auth = getAuth(app);

export {fireDB, auth}