import React, { useState } from "react";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { firestore } from "../firebase.config";
import { toast } from "react-toastify";

const Profile = () => {
  const auth = getAuth();
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    email: auth.currentUser.email,
    name: auth.currentUser.displayName,
  });
  const { name, email } = formData;
  const navigate = useNavigate();
  const handleLogOut = () => {
    signOut(auth);
    navigate("/");
  };
  const handleSubmit = async (e) => {
    try {
      // Update Display Name in Firebase Auth
      if (auth.currentUser.displayName !== name) {
        updateProfile(auth.currentUser, { displayName: name });
      }
      // Update email and Name in Firestore
      const userRef = doc(firestore, "users", auth.currentUser.uid);
      await updateDoc(userRef, { name });
    } catch (error) {
      toast.error("Could not update profile details!");
    }
  };

  const handleChange = (e) => {
    setFormData((previousState) => ({
      ...previousState,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">Profile</p>
        <button className="logOut" type="button" onClick={handleLogOut}>
          Log Out
        </button>
      </header>
      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && handleSubmit();
              setChangeDetails((previousState) => !previousState);
            }}
          >
            {changeDetails ? "Submit" : "Change"}
          </p>
        </div>
        <div className="profileCard">
          <form>
            <input
              type="text"
              className={!changeDetails ? "profileName" : "profileNameActive"}
              id="name"
              value={name}
              onChange={handleChange}
              disabled={!changeDetails}
            />
            <input
              type="text"
              // className={!changeDetails ? "profileEmail" : "profileEmailActive"}
              className="profileEmail"
              id="email"
              value={email}
              onChange={handleChange}
              disabled={!changeDetails}
            />
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;
