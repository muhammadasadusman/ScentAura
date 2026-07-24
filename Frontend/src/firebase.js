import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider ,onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDEN_W6yG9BWFYJPjD2DHfG3rz6qz_gehQ",
  authDomain: "scentaura-542c6.firebaseapp.com",
  projectId: "scentaura-542c6",
  storageBucket: "scentaura-542c6.firebasestorage.app",
  messagingSenderId: "170949469239",
  appId: "1:170949469239:web:673ad31aa63dded09a4bb2",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

export default app;