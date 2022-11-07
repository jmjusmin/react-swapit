import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase.config";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import Spinner from "./Spinner";

function Slider() {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const docRef = collection(db, "listings");
      const q = query(docRef, orderBy("timestamp", "desc"), limit(10));
      const querySnap = await getDocs(q);

      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    listings && (
      <>
        <p className="exploreHeading">Recommened</p>
        <Swiper // install Swiper modules
          modules={[Pagination]}
          slidesPerView={3}
          pagination={{ clickable: true }}
        >
          {listings.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.category}/${id}`)}
            >
              <div
                style={{
                  background: `url(${
                    data.imageUrls[data.imageUrls.length - 1]
                  }) center no-repeat`,
                  backgroundSize: "cover",
                  minHeight: "20rem",
                }}
                className="swiperSlideDiv"
              >
                <div className="swiperSlideText">
                  {data.name.toUpperCase()} -{" "}
                  {data.brand.charAt(0).toUpperCase() + data.brand.slice(1)}
                </div>
                <div className="swiperSlidePrice">
                  ${data.discountPrice ?? data.regularPrice}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
}

export default Slider;
