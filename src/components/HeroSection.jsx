import React from "react";
import { assets } from "../assets/assets";
import { ArrowRight, Calendar1Icon, ClockIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <header className='flex flex-col items-start justify-center gap-3 sm:gap-4 px-4 sm:px-6 md:px-16 lg:px-36 bg-[url("/backgroundImage.png")] bg-cover bg-center h-screen'>
      <img
        src={assets.marvelLogo}
        alt="Marvel"
        className="max-h-8 sm:max-h-11 lg:h-11 mt-16 sm:mt-20"
      />
      <h1 className="text-3xl sm:text-4xl md:text-[70px] leading-tight md:leading-[1.1] font-semibold max-w-[90%] md:max-w-[800px]">
        Guardians Of The Galaxy
      </h1>
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base text-gray-300">
        <span>Action | Adventure | Sci-Fi</span>
        <div className="flex items-center gap-1">
          <Calendar1Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> 2018
        </div>
        <div className="flex items-center gap-1">
          <ClockIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> 2h 8m
        </div>
      </div>
      <p className="text-sm sm:text-base max-w-[95%] sm:max-w-md text-gray-300">
        A bunch of skilled criminals led by brash adventurer Peter Quill join
        hands to fight a villain named Ronan the Accuser who wants to control
        the universe with the help of a mystical orb.
      </p>
      <button
        onClick={() => navigate("/movies")}
        className="flex items-center gap-1 px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer mt-2"
      >
        Explore Movies
        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </header>
  );
};

export default HeroSection;
