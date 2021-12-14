import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import Spinner from "../components/Spinner";
import { firestore } from "../firebase.config";

const Category = () => {
  const [listings, setListings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    (async () => {
      try {
        const listingsRef = collection(firestore, "listings");
        const qry = query(
          listingsRef,
          where("type", "==", params.categoryName),
          orderBy("timestamp", "desc"),
          limit(10)
        );
        const list = [];

        const querySnapshot = await getDocs(qry);
        querySnapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(list);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          Place for
          {params.categoryName === "rent" ? " Rent" : " Sale"}
        </p>
      </header>
      {isLoading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((item) => (
                <h3 key={item.id}>{item.data.name}</h3>
              ))}
            </ul>
          </main>
        </>
      ) : (
        <h3>Nothing to Display yet!</h3>
      )}
    </div>
  );
};

export default Category;
