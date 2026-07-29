import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA3_UP638mxCLOw7y0eYxRbdo-35k7xcnA", // Fixed: Used 'O' instead of '0'
  authDomain: "vege-28446.firebaseapp.com",
  projectId: "vege-28446",
  storageBucket: "vege-28446.firebasestorage.app",
  messagingSenderId: "30647005097",
  appId: "1:30647005097:web:7a3ba2b08239af45f79eb8",
  measurementId: "G-6F5QVLZFY4"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };