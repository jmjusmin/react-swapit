import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";

function SignUp() {
  const [showPwd, setShowPwd] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  //destructure from formData
  const { name, email, password } = formData;

  //init navigate
  const navigate = useNavigate();

  //update formData state
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value, //get email or pwd value from input
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // Signed in with email and password via firebase
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      //get user info
      const user = userCredential.user;

      updateProfile(auth.currentUser, {
        displayName: name,
      });

      //copy formData, so we dont have to change state of formData
      //then copy all the data to formDataCopy except password
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      //set a document
      //https://firebase.google.com/docs/firestore/manage-data/add-data?hl=en&authuser=0
      //setDoc(doc(database, name of collection, user's id), the data);
      await setDoc(doc(db, "users", user.uid), formDataCopy);

      //redirect to home page
      navigate("/");
    } catch (error) {
      toast.error("Something went wrong with registeration.");
    }
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>
        <main>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              className="nameInput"
              placeholder="Name"
              id="name"
              value={name}
              onChange={onChange}
            />
            <input
              type="email"
              className="emailInput"
              placeholder="Email"
              id="email"
              value={email}
              onChange={onChange}
            />
            <div className="passwordInputDiv">
              <input
                type={showPwd ? "text" : "password"}
                className="passwordInput"
                placeholder="Password"
                id="password"
                value={password}
                onChange={onChange}
              />
              <img
                src={visibilityIcon}
                alt="show password"
                className="showPassword"
                onClick={() => setShowPwd((prevState) => !prevState)}
              />
            </div>

            <Link to="/forgot-password" className="forgotPasswordLink">
              Forgot Password?
            </Link>

            <div className="signUpBar">
              <p className="signUpText">Sign Up</p>
              <button className="signUpButton">
                <ArrowRightIcon fill="#fff" width="34px" height="34px" />
              </button>
            </div>
          </form>

          {/* @TODO google OAuth */}

          <Link to="/sign-in" className="registerLink">
            Sign In Instead
          </Link>
        </main>
      </div>
    </>
  );
}

export default SignUp;
