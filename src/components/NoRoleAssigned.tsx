import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { FreeMode, Pagination } from "swiper/modules";
import gola from "../photos/gola.png"; // Assuming this is a placeholder image


const NoRoleAssigned = () => {
  // Create sample slide data (replace with your actual data)
  const slideData = [
    {
      imageUrl: gola, // Replace with your image URL
      title: "Slide Title 1",
      description: "Slide Description 1",
    },
    // Add more slide objects as needed
  ];

  return (
    <div
      style={{ backgroundImage: "url(/bg-2.jpg)" }}
      className="flex-1 flex items-center justify-center bg-cover bg-center"
    >
      <div className="flex flex-col gap-20 max-w-[80%] text-center items-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="font-semibold text-white text-[50px]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-white">
              {" "}
              No role assigned yet{" "}
            </span>
          </h1>
          <p className="text-gray-400 text-[20px]">Contact Admin</p>
          <p className="text-gray-200 text-[20px] pt-10 font-bold">Our Services</p>
        </div>
      </div>

      
    </div>
  );
};

export default NoRoleAssigned;
