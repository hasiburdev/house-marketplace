import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { firestore } from "../firebase.config";
import Spinner from "./Spinner";

import SwiperCore, { Pagination, Navigation, A11y, Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

const Slider = () => {
  const [listings, setListings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getListings = async () => {
      const docRef = collection(firestore, "listings");
      const qry = query(docRef, orderBy("timestamp", "desc"), limit(5));
      const docSnap = await getDocs(qry);

      let localListings = [];
      docSnap.forEach((doc) => {
        return localListings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(localListings);

      setIsLoading(false);
    };
    getListings();
  }, []);

  if (isLoading) return <Spinner />;

  if (listings.length === 0) return <></>;

  return (
    listings && (
      <>
        <p className="exploreHeading">Recommended</p>
        <Swiper
          style={{
            cursor: "pointer",
            borderRadius: "15px",
            overflow: "hidden",
          }}
          slidesPerView={1}
          pagination={{ clickable: true }}
        >
          {listings.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <div
                className="swiperSlideDiv"
                style={{
                  background: `url(${data.imgUrls[0]}) no-repeat center`,
                  backgroundSize: "cover",
                }}
              >
                <p className="swiperSlideText">{data.name}</p>
                <p className="swiperSlidePrice">
                  {data.offer ? data.discountedPrice : data.regularPrice}
                  {data.type === "rent" && " / month"}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
};

export default Slider;
