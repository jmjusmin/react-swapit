import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

function Category() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        //get reference
        // const listingsRef = collection(db, "listings");

        //create a query
        const q = query(
          collection(db, "listings"),
          where("category", "==", params.categoryName),
          orderBy("timestamp", "desc"),
          limit(10)
        );

        //execute query, then get a document
        const querySnap = await getDocs(q);

        //get the last list to load more listing
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);

        //create array of listing and store data in there
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error("Could not fecth lisings.");
      }
    };

    fetchListing();
  }, [params.categoryName]);

  //Paginatin / Load more
  const onFetchMoreListing = async () => {
    try {
      //get reference
      // const listingsRef = collection(db, "listings");

      //create a query
      const q = query(
        collection(db, "listings"),
        where("category", "==", params.categoryName),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(10)
      );

      //execute query, then get a document
      const querySnap = await getDocs(q);

      //get the last list to load more listing
      const lastVisible = querySnap.docs[querySnap.length - 1];
      setLastFetchedListing(lastVisible);

      //create array of listing and store data in there
      const listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error("Could not fecth lisings.");
    }
  };

  return (
    <div className="category">
      <header>
        <p className="pageHeader">{params.categoryName.toUpperCase()}</p>
      </header>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categotyListings">
              {listings.map((listing) => (
                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul>
          </main>
          <br />
          <br />
          {lastFetchedListing && (
            <p className="loadMore" onClick={onFetchMoreListing}>
              Load more
            </p>
          )}
        </>
      ) : (
        <p>No listings for {params.categoryName}</p>
      )}
    </div>
  );
}

export default Category;
