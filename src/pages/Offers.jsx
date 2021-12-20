import React, { useState, useEffect } from "react";
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

const Offers = () => {
  const [listings, setListings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const listingsRef = collection(firestore, "listings");
        const qry = query(
          listingsRef,
          where("offer", "==", true),
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
        console.log(error);
      }
      setIsLoading(false);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadMore = async () => {
    try {
      const listingsRef = collection(firestore, "listings");
      const qry = query(
        listingsRef,
        where("offer", "==", true),
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
      console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <div className="category">
      <header>
        <p className="pageHeader">Offers</p>
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
            <br />
            <br />
            {lastFetchedListing && (
              <p className="loadMore" onClick={handleLoadMore}>
                Load More
              </p>
            )}
          </main>
        </>
      ) : (
        <h3>Currently There Are No Offers!</h3>
      )}
    </div>
  );
};

export default Offers;
