import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAqVLXJNtqxxSYN_eKwYOPeZZuYE52xiJo",
  authDomain: "house-marketplace-c7ab2.firebaseapp.com",
  projectId: "house-marketplace-c7ab2",
  storageBucket: "house-marketplace-c7ab2.appspot.com",
  messagingSenderId: "150981001237",
  appId: "1:150981001237:web:c38e5ce5234b04e58cce1c",
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
