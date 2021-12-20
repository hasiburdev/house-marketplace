import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { firestore } from "../firebase.config";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";
import { toast } from "react-toastify";

const Category = () => {
  const [listings, setListings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  const params = useParams();

  useEffect(() => {
    const getListings = async () => {
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

        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastFetchedListing(lastVisible);

        querySnapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(list);
      } catch (error) {
        toast.error("Something went wrong!");
      }
      setIsLoading(false);
    };
    getListings();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadMore = async () => {
    try {
      const listingsRef = collection(firestore, "listings");
      const qry = query(
        listingsRef,
        where("type", "==", params.categoryName),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(10)
      );
      const list = [];

      const querySnapshot = await getDocs(qry);

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastFetchedListing(lastVisible);

      querySnapshot.forEach((doc) => {
        list.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings((previousState) => [...previousState, ...list]);
    } catch (error) {
      toast.error("Something went wrong!");
    }
    setIsLoading(false);
  };

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
                <ListingItem key={item.id} listing={item.data} id={item.id} />
              ))}
            </ul>
          </main>
          <br />
          <br />
          {lastFetchedListing && (
            <p className="loadMore" onClick={handleLoadMore}>
              Load More
            </p>
          )}
        </>
      ) : (
        <h3>Nothing to Display yet!</h3>
      )}
    </div>
  );
};

export default Category;
