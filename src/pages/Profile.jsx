import React, { useState, useEffect } from "react";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import {
  doc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { firestore } from "../firebase.config";
import { toast } from "react-toastify";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

const Profile = () => {
  const auth = getAuth();
  const [changeDetails, setChangeDetails] = useState(false);
  const [listings, setlistings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: auth.currentUser.email,
    name: auth.currentUser.displayName,
  });
  const { name, email } = formData;
  const navigate = useNavigate();

  // TODO: 110=> 1:42

  useEffect(() => {
    const getUserListings = async () => {
      const listingsRef = collection(firestore, "listings");
      const qry = query(
        listingsRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(qry);
      const tempListing = [];
      querySnap.forEach((doc) => {
        tempListing.push({
          data: doc.data(),
          id: doc.id,
        });
      });

      setlistings(tempListing);
      console.log(tempListing);
      setIsLoading(false);
    };

    getUserListings();
  }, [auth.currentUser.uid]);

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

  const handleDelete = async (listingId) => {
    if (window.confirm("Are you sure you want to DELETE this listing?")) {
      await deleteDoc(doc(firestore, "listings", listingId));
      const updatedListing = listings.filter(
        (listing) => listings.id !== listingId
      );
      setlistings(updatedListing);
      toast.success("Listing Deleted Successfully!");
    }
  };

  const handleEdit = async (listingId) =>
    navigate(`/edit-listing/${listingId}`);

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
        <Link to="/create-listing" className="createListing">
          <img src={homeIcon} alt="Home" />
          <p>Sell or Rent your Home</p>
          <img src={arrowRight} alt="" />
        </Link>
        {isLoading && <Spinner />}

        {!isLoading && listings && (
          <>
            <p className="listingText">Listings</p>
            <ul className="listingList">
              {listings?.map(({ data, id }) => (
                <ListingItem
                  key={id}
                  listing={data}
                  id={id}
                  handleDelete={() => handleDelete(id)}
                  handleEdit={() => handleEdit(id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
};

export default Profile;
