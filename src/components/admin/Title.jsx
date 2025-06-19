import React from "react";

const Title = ({ text1, text2 }) => {
  return (
    <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl text-white">
      {text1}{" "}
      <span className="text-red-600 drop-shadow-lg hover:text-red-500 transition-colors duration-300">
        {text2}
      </span>
    </h1>
  );
};

export default Title;
