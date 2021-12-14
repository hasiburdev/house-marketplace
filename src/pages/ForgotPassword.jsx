import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("Email was sent!");
    } catch (error) {
      toast.error("Could not Send Email!");
    }
  };
  const handleChange = (e) => setEmail(e.target.value);

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Forgot Password</p>
        <main>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              className="emailInput"
              id="email"
              placeholder="Email"
              value={email}
              onChange={handleChange}
            />
            <Link to="/sign-in" className="forgotPasswordLink">
              Sign In Instead
            </Link>
            <div className="signInBar">
              <p className="signInText">Send Email</p>
              <button className="signInButton">
                <ArrowRightIcon fill="#fff" width="34px" height="34px" />
              </button>
            </div>
          </form>
        </main>
      </header>
    </div>
  );
};

export default ForgotPassword;
