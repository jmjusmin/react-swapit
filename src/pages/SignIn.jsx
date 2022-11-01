import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";

function SignIn() {
  const [showPwd, setShowPwd] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  //destructure from formData
  const { email, password } = formData;

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
      //init auth
      const auth = getAuth();

      //this will return a promise
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      //checking
      if (userCredential.user) {
        navigate("/");
      }
    } catch (error) {
      toast.error("Bad Credentials.");
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

            <div className="signInBar">
              <p className="signInText">Sign In</p>
              <button className="signInButton">
                <ArrowRightIcon fill="#fff" width="34px" height="34px" />
              </button>
            </div>
          </form>

          {/* @TODO google OAuth */}

          <Link to="/sign-up" className="registerLink">
            Sign Up Instead
          </Link>
        </main>
      </div>
    </>
  );
}

export default SignIn;
