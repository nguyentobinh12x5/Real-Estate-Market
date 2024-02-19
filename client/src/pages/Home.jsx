import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ListingItem from "../components/ListingItem";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import { Navigation } from "swiper/modules";
const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  SwiperCore.use([Navigation]);
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get("/api/listing/get");
        const data = response.data;
        setData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchListings();
  }, []);
  return (
    <div>
      {/* Top */}
      <div className="flex flex-col gap-6 max-w-6xl mx-auto px-3 py-28">
        <h1 className=" text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next perfect
          <br />
          place with ease
        </h1>
        <p className=" text-slate-400 text-xs sm:text-sm">
          Sahand Estate will help you find your home fast, easy and comfortable.
          <br />
          Our expert support are always available.
        </p>
        <p className=" text-xs sm:text-sm text-blue-900 font-bold hover:underline">
          Let's Start now...
        </p>
      </div>
      {/* Swiper */}
      <div>
        <Swiper navigation>
          {data &&
            data.length > 0 &&
            data.map((listing) => (
              <SwiperSlide>
                <div
                  style={{
                    background: `url(${listing.imageUrls[0]}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                  className="h-[500px]"
                  key={listing._id}
                ></div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
      {/* Listing result for offer, sale, and rent */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {loading && <p className="text-center my-7 text-2xl ">Loading...</p>}
        {error && <p className="text-center my-7 text-2xl ">{error.message}</p>}
        {data && data.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent offers
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?offer=true"}
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {data.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {data && data.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for rent
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?offer=true"}
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {data.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {data && data.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for sale
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?offer=true"}
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {data.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
