import { useLocation, useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import googleIcon from "../assets/svg/googleIcon.svg";
import facebookIcon from "../assets/svg/facebookIcon.svg";

function OAuth() {
  //init
  const navigate = useNavigate();
  const location = useLocation();

  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      //create provider
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      //get a user from google the compare it to the document's reference
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      //check if user doesn't exist in db
      if (!docSnap.exists()) {
        //create user in db
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      //after sign-in/sign-up, then navigate to home
      navigate("/");
    } catch (error) {
      toast.error("Could not authorize with Google");
    }
  };

  const onFacebookClick = async () => {
    try {
      const auth = getAuth();
      //create provider
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      const credential = FacebookAuthProvider.credentialFromResult(result);
      // eslint-disable-next-line
      const accessToken = credential.accessToken;

      //get a user from google the compare it to the document's reference
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      //check if user doesn't exist in db
      if (!docSnap.exists()) {
        //create user in db
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      //after sign-in/sign-up, then navigate to home
      navigate("/");
    } catch (error) {
      toast.error("Could not authorize with Facebook.");
    }
  };

  return (
    <div className="socialLogin">
      <p>Sign {location.pathname === "/sign-up" ? "up" : "in"} with </p>
      <div className="socialIconDivBtn">
        <button className="socialIconDiv" onClick={onGoogleClick}>
          <img src={googleIcon} alt="google" className="socialIconImg" />
        </button>
        <button className="socialIconDiv" onClick={onFacebookClick}>
          <img src={facebookIcon} alt="facebook" className="socialIconImg" />
        </button>
      </div>
    </div>
  );
}

export default OAuth;
