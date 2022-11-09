import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon } from "../assets/svg/editIcon.svg";

function ListingItem({ listing, id, onEdit, onDelete }) {
  return (
    <li className="categoryListing">
      <Link
        to={`/category/${listing.category}/${id}`}
        className="categoryListingLink"
      >
        <img
          src={listing.imageUrls[listing.imageUrls.length - 1]}
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
      {onEdit && (
        <EditIcon className="editIcon" onClick={() => onEdit(listing.id)} />
      )}
      {onDelete && (
        <DeleteIcon
          className="removeIcon"
          fill="#fb2576"
          onClick={() => onDelete(listing.id, listing.name)}
        />
      )}
    </li>
  );
}

export default ListingItem;
