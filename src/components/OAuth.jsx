import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { setDoc, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "../firebase.config";
import googleIcon from "../assets/svg/googleIcon.svg";

const OAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoogleSignIn = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user already exists
      const userRef = doc(firestore, "users", user.uid);
      const docSnap = await getDoc(userRef);
      // Save user data
      if (!docSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/");
    } catch (error) {}
  };

  return (
    <div className="socialLogin">
      <p>Sign {location.pathname === "/sign-up" ? "up" : "in"} with </p>
      <button className="socialIconDiv" onClick={handleGoogleSignIn}>
        <img src={googleIcon} alt="google" className="socialIconImg" />
      </button>
    </div>
  );
};

export default OAuth;
