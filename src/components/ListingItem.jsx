import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";

function ListingItem({ listing, id, onDelete }) {
  return (
    <li className="categoryListing">
      <Link
        to={`/category/${listing.category}/${id}`}
        className="categoryListingLink"
      >
        <img
          src={listing.imageUrls[0]}
          alt={listing.name}
          className="categoryListingImg"
        />
        <div className="categoryListingDetails">
          <p className="categoryListingBrand">
            {listing.brand.charAt(0).toUpperCase() + listing.brand.slice(1)}
          </p>
          <p className="categoryListingName">{listing.name.toUpperCase()}</p>
          <p className="categoryListingPrice">
            {listing.offer && (
              <>
                <span className="categoryListingPrice-regular">
                  ${listing.regularPrice}
                </span>
                <span className="categoryListingPrice">
                  ${listing.discountPrice}
                </span>
              </>
            )}
            {listing.offer ? null : "$" + listing.regularPrice}
          </p>
          <div className="categoryInfoDiv">
            <p className="categoryListingInfoText">
              Condition : {listing.condition}
            </p>
            <p className="categoryListingInfoText">Size : {listing.size}</p>
          </div>
        </div>
      </Link>
      {onDelete && (
        <DeleteIcon
          className="removeIcon"
          fill="rgb(231,76,60)"
          onClick={() => onDelete(listing.id, listing.name)}
        />
      )}
    </li>
  );
}

export default ListingItem;
