import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

function CreateListing() {
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "top",
    brand: "",
    color: "",
    size: "m",
    condition: "good",
    address: "",
    offer: false,
    regularPrice: 0,
    discountPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  });

  //destructure formData
  const {
    name,
    category,
    brand,
    color,
    size,
    condition,
    address,
    offer,
    regularPrice,
    discountPrice,
    images,
    latitude,
    longitude,
  } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate("/sign-in");
        }
      });
    }

    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  const onSubmit = (e) => {
    e.preventDefault();
  };

  const onMutate = (e) => {
    let boolean = null;

    //convert text to boolean
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }

    //check files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    //check text/boolean/number
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  if (loading) {
    return <Spinner />;
  }
  return (
    <div className="profile">
      <header>
        <p className="pageHeader">Create a Listing</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          {/* Name of listing */}
          <label className="formLabel">Name</label>
          <input
            className="formInputName"
            type="text"
            id="name"
            value={name}
            onChange={onMutate}
            maxLength="32"
            minLength="10"
            required
          />
          {/* Category of listing */}
          <label className="formLabel">Category</label>
          <div className="formButtons">
            <button
              type="button"
              className={category === "top" ? "formButtonActive" : "formButton"}
              id="category"
              value="top"
              onClick={onMutate}
            >
              Top
            </button>
            <button
              type="button"
              className={
                category === "bottom" ? "formButtonActive" : "formButton"
              }
              id="category"
              value="bottom"
              onClick={onMutate}
            >
              Bottom
            </button>
            <button
              type="button"
              className={
                category === "dress" ? "formButtonActive" : "formButton"
              }
              id="category"
              value="dress"
              onClick={onMutate}
            >
              Dress
            </button>
          </div>

          <div className="flex">
            <div>
              {/* Brand of listing */}
              <label className="formLabel">Brand</label>
              <input
                className="formInputName"
                type="text"
                id="brand"
                value={brand}
                onChange={onMutate}
                maxLength="15"
                minLength="2"
                required
              />
            </div>
            <div>
              {/* Color of listing */}
              <label className="formLabel">Color</label>
              <input
                className="formInputName"
                type="text"
                id="color"
                value={color}
                onChange={onMutate}
                maxLength="15"
                minLength="3"
                required
              />
            </div>
          </div>
          {/* Size of listing */}
          <label className="formLabel">Size</label>
          <div className="formButtons">
            <button
              type="button"
              className={size === "s" ? "formButtonActive" : "formButton"}
              id="size"
              value="s"
              onClick={onMutate}
            >
              s
            </button>
            <button
              type="button"
              className={size === "m" ? "formButtonActive" : "formButton"}
              id="size"
              value="m"
              onClick={onMutate}
            >
              m
            </button>
            <button
              type="button"
              className={size === "l" ? "formButtonActive" : "formButton"}
              id="size"
              value="l"
              onClick={onMutate}
            >
              l
            </button>
            <button
              type="button"
              className={size === "xl" ? "formButtonActive" : "formButton"}
              id="size"
              value="xl"
              onClick={onMutate}
            >
              xl
            </button>
          </div>

          {/* Condition of listing */}
          <label className="formLabel">Condition</label>
          <div className="formButtons">
            <button
              type="button"
              className={
                condition === "fair" ? "formButtonActive" : "formButton"
              }
              id="condition"
              value="fair"
              onClick={onMutate}
            >
              Fair
            </button>
            <button
              type="button"
              className={
                condition === "good" ? "formButtonActive" : "formButton"
              }
              id="condition"
              value="good"
              onClick={onMutate}
            >
              Good
            </button>
            <button
              type="button"
              className={
                condition === "excellent" ? "formButtonActive" : "formButton"
              }
              id="condition"
              value="excellent"
              onClick={onMutate}
            >
              Excellent
            </button>
          </div>

          {/* Address to meet up */}
          <label className="formLabel">Address</label>
          <textarea
            className="formInputAddress"
            type="text"
            id="address"
            value={address}
            onChange={onMutate}
            required
          />

          {!geolocationEnabled && (
            <div className="formLatLng flex">
              <div>
                <label className="formLabel">Latitude</label>
                <input
                  className="formInputSmall"
                  type="number"
                  id="latitude"
                  value={latitude}
                  onChange={onMutate}
                  required
                />
              </div>
              <div>
                <label className="formLabel">Longitude</label>
                <input
                  className="formInputSmall"
                  type="number"
                  id="longitude"
                  value={longitude}
                  onChange={onMutate}
                  required
                />
              </div>
            </div>
          )}

          {/* Special offer for listing? */}
          <label className="formLabel">Offer</label>
          <div className="formButtons">
            <button
              className={offer ? "formButtonActive" : "formButton"}
              type="button"
              id="offer"
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !offer && offer !== null ? "formButtonActive" : "formButton"
              }
              type="button"
              id="offer"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <div className="flex">
            <div>
              <label className="formLabel">Regular Price</label>
              <div className="formPriceDiv">
                <input
                  className="formInputSmall"
                  type="number"
                  id="regularPrice"
                  value={regularPrice}
                  onChange={onMutate}
                  min="5"
                  max="5000"
                  required
                />
              </div>
            </div>

            <div>
              {offer && (
                <>
                  <label className="formLabel">Discounted Price</label>
                  <input
                    className="formInputSmall"
                    type="number"
                    id="discountPrice"
                    value={discountPrice}
                    onChange={onMutate}
                    min="5"
                    max="5000"
                    required={offer}
                  />
                </>
              )}
            </div>
          </div>
          <label className="formLabel">Images</label>
          <p className="imagesInfo">
            The first image will be the cover (max 6).
          </p>
          <input
            className="formInputFile"
            type="file"
            id="images"
            onChange={onMutate}
            max="6"
            accept=".jpg,.png,.jpeg"
            multiple
            required
          />
          <button type="submit" className="primaryButton createListingButton">
            Create Listing
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateListing;
