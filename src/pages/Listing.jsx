import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import shareIcon from "../assets/svg/shareIcon.svg";

function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);

      //checking docSnap
      if (docSnap.exists()) {
        console.log(docSnap.data());
        setListing(docSnap.data());
        setLoading(false);
      }
    };
    fetchListing();
  }, [navigate, params.listingId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      <div
        className="shareIconDiv"
        onClick={() => {
          //copy to clipboard
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <img src={shareIcon} alt="share" />
        {shareLinkCopied && <p className="linkCopied">Link Copied!</p>}
      </div>

      <div className="listingDetails">
        <div className="flex">
          <Swiper
            // install Swiper modules
            modules={[Pagination]}
            slidesPerView={1}
            pagination={{ clickable: true }}
            className="swiper-override "
          >
            {listing.imageUrls
              .map((url, index) => (
                <SwiperSlide key={index}>
                  <div
                    style={{
                      background: `url(${listing.imageUrls[index]}) center no-repeat`,
                      backgroundSize: "cover",
                      minHeight: "30rem",
                    }}
                    className="swiperSlideDiv"
                  ></div>
                </SwiperSlide>
              ))
              .reverse()}
          </Swiper>
          <div className="flex-col">
            <p className="listingName">
              {listing.name} - $
              {listing.offer ? listing.discountPrice : listing.regularPrice}
            </p>
            <p className="listingBrand">
              {listing.brand.charAt(0).toUpperCase() + listing.brand.slice(1)}
            </p>
            <p className="listingType">{listing.category}</p>
            {listing.offer && (
              <p className="discountPrice">
                ${listing.regularPrice - listing.discountPrice} discount
              </p>
            )}
            <ul className="listingDetailsList">
              <li>Color: {listing.color}</li>
              <li>Size: {listing.size}</li>
              <li>Condition: {listing.condition}</li>
            </ul>
          </div>
        </div>

        {/* Location */}
        <p className="listingLocationTitle">Meet up Location</p>
        <div className="leafletContainer">
          <MapContainer
            style={{ height: "100%", width: "100%" }}
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
            ></TileLayer>

            <Marker
              position={[listing.geolocation.lat, listing.geolocation.lng]}
            >
              <Popup>{listing.location}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className="primaryButton"
          >
            Contact seller
          </Link>
        )}
      </div>
    </main>
  );
}

export default Listing;
