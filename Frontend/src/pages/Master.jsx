import React from 'react';
import { Outlet } from 'react-router-dom';
const Master = () => {
  return (
    <div className="bg-[#ffffff] rounded-t-xl  transition-all duration-300">
      <div className="h-full shadow-xl">
        <div className="overflow-x-auto shadow-md rounded-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Master;
