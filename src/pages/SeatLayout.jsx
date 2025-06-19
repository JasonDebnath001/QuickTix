import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets, dummyDateTimeData, dummyShowsData } from "../assets/assets";
import Loading from "../components/Loading";
import { ArrowRightIcon, ClockIcon } from "lucide-react";
import { isoTimeFormat } from "../lib/timeFormat";
import BlurCircle from "../components/BlurCircle";
import toast from "react-hot-toast";

const SeatLayout = () => {
  const { id, date } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);
  const navigate = useNavigate();
  const groupRows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

  const getShow = async () => {
    const show = dummyShowsData.find((show) => show._id === id);
    if (show) {
      setShow({
        movie: show,
        dateTime: dummyDateTimeData,
      });
    }
  };

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast.error("Please select time first");
    }
    // If seat is already selected, allow deselection
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats((prev) => prev.filter((seat) => seat !== seatId));
      return;
    }
    // If seat is not selected and adding it would exceed limit
    if (selectedSeats.length >= 5) {
      return toast.error("You can only select 5 seats");
    }
    // Add the new seat
    setSelectedSeats((prev) => [...prev, seatId]);
  };

  const renderSeats = (row, count = 8) => {
    return (
      <div key={row} className="flex items-center gap-4">
        <span className="w-6 text-center">{row}</span>
        <div className="flex gap-2">
          {/* First group (1-4) */}
          <div className="flex gap-2">
            {Array.from({ length: 4 }, (_, i) => (
              <button
                key={`${row}${i + 1}`}
                onClick={() => handleSeatClick(`${row}${i + 1}`)}
                className={`h-8 w-8 rounded border border-primary/60 cursor-pointer ${
                  selectedSeats.includes(`${row}${i + 1}`) &&
                  "bg-primary text-white"
                }`}
              >
                {`${row}${i + 1}`}
              </button>
            ))}
          </div>
          {/* Gap between seats */}
          <div className="w-8"></div>
          {/* Second group (5-8) */}
          <div className="flex gap-2">
            {Array.from({ length: 4 }, (_, i) => (
              <button
                key={`${row}${i + 5}`}
                onClick={() => handleSeatClick(`${row}${i + 5}`)}
                className={`h-8 w-8 rounded border border-primary/60 cursor-pointer ${
                  selectedSeats.includes(`${row}${i + 5}`) &&
                  "bg-primary text-white"
                }`}
              >
                {`${row}${i + 5}`}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getShow();
  }, []);

  return show ? (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50">
      {/* available timings */}
      <div className="w-60 bg-primary/10 border border-accent/20 rounded-lg py-10 h-max md:sticky md:top-30">
        <p className="text-lg font-semibold px-6">Available Timings</p>
        <div className="mt-5 space-y-1">
          {show.dateTime[date].map((item) => (
            <div
              key={item.time}
              onClick={() => setSelectedTime(item)}
              className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${
                selectedTime?.time === item.time
                  ? "bg-primary text-white"
                  : "hover:bg-primary/20"
              }`}
            >
              <ClockIcon className="w-4 h-4" />
              <p className="text-sm">{isoTimeFormat(item.time)}</p>
            </div>
          ))}
        </div>
      </div>
      {/* seat layout */}
      <div className="relative flex-1 flex flex-col items-center max-md:mt-16">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle top="0px" left="0px" />
        <h1 className="text-2xl font-semibold mb-4">Select Your Seat</h1>
        <img src={assets.screenImage} alt="Screen" className="max-w-full" />
        <p className="text-gray-600 text-sm mb-6">Screen Side</p>
        {/* Added overflow container */}
        <div className="w-full overflow-x-auto pb-4">
          <div className="flex flex-col items-center mt-10 text-xs text-gray-300 min-w-[350px]">
            <div className="flex flex-col gap-4">
              {groupRows.map((row) => renderSeats(row))}
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/my-bookings")}
          className="flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95"
        >
          Proceed to Checkout{" "}
          <ArrowRightIcon strokeWidth={3} className="w-4 h-4" />
        </button>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default SeatLayout;
