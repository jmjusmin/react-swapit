import { Link } from "react-router-dom";
import Slider from "../components/Slider";
import topCategoryImg from "../assets/jpg/topCategoryImg.jpg";
import bottomCategoryImg from "../assets/jpg/bottomCategoryImg.jpg";
import dressCategoryImg from "../assets/jpg/dressCategoryImg.jfif";

function Explore() {
  return (
    <div className="explore pageContainer">
      <header>
        <p className="pageHeader">Explore</p>
      </header>
      <main className="category">
        <Slider />
        <p className="exploreCategoryHeading">Categories</p>
        <div className="exploreCategories">
          <Link to="/category/top">
            <img
              src={topCategoryImg}
              alt="top"
              className="exploreCategoryImg"
            />
            <p className="exploreCategoryName">Top</p>
          </Link>
          <Link to="/category/bottom">
            <img
              src={bottomCategoryImg}
              alt="bottom"
              className="exploreCategoryImg"
            />
            <p className="exploreCategoryName">Bottom</p>
          </Link>
          <Link to="/category/dress">
            <img
              src={dressCategoryImg}
              alt="dress"
              className="exploreCategoryImg"
            />
            <p className="exploreCategoryName">Dress</p>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Explore;
