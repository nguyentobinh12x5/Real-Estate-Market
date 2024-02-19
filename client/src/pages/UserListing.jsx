import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
const UserListing = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        const response = await axios.get(`/api/user/listings/${id}`);
        const data = response.data;
        setData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchUserListings();
  }, []);
  const handleDelete = async (listingId) => {
    try {
      const res = await axios.delete(`/api/listing/delete/${listingId}`);
      const data = res.data;
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setData((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="max-w-6xl mx-auto p-3">
      <h1 className="text-3xl font-semibold text-center my-7">My lists</h1>
      <div className="flex flex-wrap gap-4">
        {data.map((listing) => (
          <div
            key={listing._id}
            className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]"
          >
            <Link to={`/listing/${listing._id}`}>
              <img
                src={listing.imageUrls[0]}
                alt={listing.name}
                className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
              />
            </Link>
            <div className="p-3 flex flex-col gap-2 w-full">
              <p className="truncate text-lg font-semibold text-slate-700">
                {listing.name}
              </p>
              <p className="text-sm text-gray-600 line-clamp-2">
                {listing.description}
              </p>
              <div className="flex gap-4 justify-between">
                <Link to={`/update-listing/${listing._id}`}>
                  <button className=" text-green-700 font-semibold">
                    Edit
                  </button>
                </Link>

                <button
                  className=" text-red-700 font-semibold"
                  onClick={() => handleDelete(listing._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserListing;
