// src/firebaseApp2.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig2 = {
    apiKey: "AIzaSyAGBVZbkkBocl9_YBGyxlNhoVTyxS8u5Eo",
    authDomain: "encuestas-app-ffdc6.firebaseapp.com",
    projectId: "encuestas-app-ffdc6",
    storageBucket: "encuestas-app-ffdc6.firebasestorage.app",
    messagingSenderId: "492595447663",
    appId: "1:492595447663:web:c03f466999dc253a3f8a9a"
};


const secondApp = initializeApp(firebaseConfig2, "secondary");

export const db2 = getFirestore(secondApp);
