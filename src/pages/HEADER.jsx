import React, { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

const HEADER = () => {
  return (
    <div className="bg-black flex justify-between items-center h-20 w-screen mx-auto px-4 text-white">
      <h1 className="p-5 w-full text-3xl font-bold text-[#00df9a]">D-ERP</h1>

      <div className="flex justify-center text-lg pr-0">
        <div className="mr-2">Balance:</div>
        <div className="mr-2">xxxx</div>
        <div className="mr-2">eth</div>
      </div>

      <div className="p-4 hover:bg-[#00df9a] rounded-xl cursor-pointer duration-300 hover:text-black m-20">
        LOGIN
      </div>
    </div>
  );
};

export default HEADER;
