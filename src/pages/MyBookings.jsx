import React, { useEffect, useState } from "react";
import { dummyBookingData } from "../assets/assets";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import { dateFormat, timeFormat } from "../lib/timeFormat";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const { axios, getToken, user, imageBaseUrl } = useAppContext();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMyBookings = async () => {
    try {
      const { data } = await axios.get("/api/user/bookings", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      getMyBookings();
    }
  }, [user]);

  return !loading ? (
    <main className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh] overflow-x-hidden">
      <BlurCircle top="-100px" left="-100px" />
      <div>
        <BlurCircle bottom="0px" left="600px" />
      </div>
      <header>
        <h1 className="text-lg font-semibold mb-4">My Bookings</h1>
      </header>
      {bookings.map((item, index) => (
        <article
          key={index}
          className="flex flex-col md:flex-row justify-between bg-primary/8 border border-accent/20 rounded-lg mt-4 p-2 max-w-3xl overflow-hidden"
        >
          <figure className="flex flex-col md:flex-row">
            <img
              src={imageBaseUrl + item.show.movie.poster_path}
              alt="Movie"
              className="w-full md:w-45 max-w-[180px] aspect-video h-auto object-cover object-bottom rounded"
            />
            <figcaption className="flex flex-col p-4">
              <p className="text-lg font-semibold">{item.show.movie.title}</p>
              <p className="text-gray-400 text-sm">
                {timeFormat(item.show.movie.runtime)}
              </p>
              <p className="text-gray-400 text-sm mt-auto">
                {dateFormat(item.show.showDateTime)}
              </p>
            </figcaption>
          </figure>
          <section className="flex flex-col md:items-end md:text-right justify-between p-4">
            <div className="flex items-center gap-4">
              <p className="text-2xl font-semibold mb-3">
                {currency}
                {item.amount}
              </p>
              {!item.isPaid && (
                <Link
                  to={item.paymentLink}
                  className="bg-primary px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer"
                >
                  Pay Now
                </Link>
              )}
            </div>
            <section className="text-sm">
              <p>
                <span className="text-gray-400">Total Tickets:</span>{" "}
                {item.bookedSeats.length}
              </p>
              <p>
                <span className="text-gray-400">Seat Number:</span>{" "}
                {item.bookedSeats.join(", ")}
              </p>
            </section>
          </section>
        </article>
      ))}
    </main>
  ) : (
    <Loading />
  );
};

export default MyBookings;
