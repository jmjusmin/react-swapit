import { useNavigate } from "react-router-dom";

function Logo() {
  const navigate = useNavigate();

  return (
    <div>
      <img
        src={require("../assets/jpg/swap_it.png")}
        className="logo"
        alt="logo"
        onClick={() => navigate("/")}
      />
    </div>
  );
}

export default Logo;
