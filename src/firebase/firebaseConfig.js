// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyChk_IzUrUDxFObK5dQET3z79eK9ekjfZM",
  authDomain: "autobooksv2.firebaseapp.com",
  projectId: "autobooksv2",
  storageBucket: "autobooksv2.appspot.com",
  messagingSenderId: "1052084545542",
  appId: "1:1052084545542:web:4b07faddf36830c84b7b87",
  measurementId: "G-HPS0SMV1WS"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
