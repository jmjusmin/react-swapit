import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { db } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

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

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    //check the discountPrice
    if (discountPrice >= regularPrice) {
      setLoading(false);
      toast.error("Discounted price needs to be less than regular price.");
      return;
    }

    if (images.length > 6) {
      setLoading(false);
      toast.error("Max 6 images.");
      return;
    }

    //set up lat, lng and address
    let geolocation = {};
    let location;
    const mapAPIKey = process.env.REACT_APP_MAP_API_KEY;

    if (geolocationEnabled) {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${mapAPIKey}`
      );
      const data = await res.json();

      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;
      location =
        data.status === "ZERO_RESULTS"
          ? undefined
          : data.results[0]?.formatted_address;

      if (location === undefined || location.includes("undefined")) {
        setLoading(false);
        toast.error("Please enter a correct address.");
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
      location = address;
    }

    //create a function to run on each img
    //that store in firebase
    //https://firebase.google.com/docs/storage/web/upload-files?hl=en&authuser=0
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        //init storage
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

        const storageRef = ref(storage, "images/" + fileName);

        const uploadTask = uploadBytesResumable(storageRef, image);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };
    const imageUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false);
      toast.error("Images not uploaded.");
      return;
    });
    console.log(imageUrls);

    setLoading(false);
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
