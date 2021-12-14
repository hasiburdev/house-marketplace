import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { firestore } from "../firebase.config";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";

const SignIn = () => {
  // TODO: Add confirm Password

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = formData;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;
      await updateProfile(auth.currentUser, {
        displayName: name,
      });
      const formDataCopy = {
        ...formData,
        timestamp: serverTimestamp(),
      };
      delete formDataCopy.password;
      setDoc(doc(firestore, "users", user.uid), formDataCopy);

      navigate("/");
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>
        <main>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="nameInput"
              placeholder="Name"
              id="name"
              value={name}
              onChange={handleChange}
            />

            <input
              type="email"
              className="emailInput"
              placeholder="Email"
              id="email"
              value={email}
              onChange={handleChange}
            />
            <div className="passwordInputDiv">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                id="password"
                value={password}
                onChange={handleChange}
                className="passwordInput"
              />
              <img
                src={visibilityIcon}
                alt="Show Password"
                onClick={() =>
                  setShowPassword((previousState) => !previousState)
                }
              />
            </div>
            <Link to="/forgot-password" className="forgotPasswordLink">
              Forgot Password?
            </Link>
            <div className="signUpBar">
              <p className="signUpText">SignUp</p>
              <button className="signUpButton">
                <ArrowRightIcon width="34px" heigth="34px" fill="#fff" />
              </button>
            </div>

            <OAuth />

            <Link to="/sign-in" className="registerLink">
              Sign In Instead
            </Link>
          </form>
        </main>
      </div>
    </>
  );
};

export default SignIn;
