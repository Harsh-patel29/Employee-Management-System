import React from 'react';
import HolidayTable from '../Components/HolidayTable.jsx';
const Holiday = () => {
  return (
    <div className="bg-[#ffffff]  transition-all duration-300">
      <div className="h-full shadow-xl">
        <div className="min-w-full px-3 shadow-md">
          <HolidayTable />
        </div>
      </div>
    </div>
  );
};

export default Holiday;
