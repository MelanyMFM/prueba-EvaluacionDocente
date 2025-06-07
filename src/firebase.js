// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, browserLocalPersistence, setPersistence } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUiGN0xwmRGAQL6NG-7SP7Uth0k9qTZTk",
  authDomain: "evaluacion-docente-dc505.firebaseapp.com",
  projectId: "evaluacion-docente-dc505",
  storageBucket: "evaluacion-docente-dc505.appspot.com",
  messagingSenderId: "910246763331",
  appId: "1:910246763331:web:8c74049451739e34feadf6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configurar el proveedor de Google
googleProvider.setCustomParameters({
  prompt: 'select_account',
  // Agregar el dominio de la UNAL como host autorizado
  hd: 'unal.edu.co'
});

// Configurar la persistencia de la sesión
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

export { auth, googleProvider }; 