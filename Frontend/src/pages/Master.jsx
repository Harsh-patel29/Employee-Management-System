import React from 'react';
import { Outlet } from 'react-router-dom';
const Master = () => {
  return (
    <div className="bg-[#ffffff] rounded-xl  transition-all duration-300">
      <div className="lg:w-[100%] md:w-[100%] sm:w-[100%] max-sm:w-[100%] h-full shadow-xl rounded-xl">
        <div className="overflow-x-auto shadow-md rounded-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Master;
