// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_API_KEY,
  authDomain: "real-estate-market-9fab4.firebaseapp.com",
  projectId: "real-estate-market-9fab4",
  storageBucket: "real-estate-market-9fab4.appspot.com",
  messagingSenderId: "304385637970",
  appId: "1:304385637970:web:a74c61956becf136cd698b",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
