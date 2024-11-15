import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDM7lsFqP93xeKh5NWR2215BITgLSDKUNk",
    authDomain: "notion-5ee00.firebaseapp.com",
    projectId: "notion-5ee00",
    storageBucket: "notion-5ee00.firebasestorage.app",
    messagingSenderId: "769998559743",
    appId: "1:769998559743:web:518aaaf3f7e195d4fbefca",
    measurementId: "G-HNT9YJNBE8"
  };
  
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore(app)

export { db }
