import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { firestore } from "../firebase.config";
import { getDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

const Contact = () => {
  const [message, setMessage] = useState(null);
  const [landlord, setLandlord] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();

  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(firestore, "users", params.landlordId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error("Could not get Landlord data!");
      }
    };

    getLandlord();
  }, [params.landlordId]);

  const handleChange = (e) => setMessage(e.target.value);

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Contact Landlord</p>
      </header>
      {landlord !== null && (
        <main>
          <div className="contactLandlord">
            <p className="landlordName">Contact {landlord?.name}</p>
          </div>
          <form className="messageForm">
            <div className="messageDiv">
              <label htmlFor="message" className="messageLabel">
                Message
              </label>
              <textarea
                name="message"
                onChange={handleChange}
                value={message}
                id="message"
                className="textarea"
              ></textarea>
            </div>
            <a
              href={`mailto:${landlord.email}?Subject=${searchParams.get(
                "listingName"
              )}&body=${message}`}
            >
              <button type="button" className="primaryButton">
                Send Message
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  );
};

export default Contact;
