import React from 'react';
import HolidayTable from '../Components/HolidayTable.jsx';
const Holiday = () => {
  return (
    <div className="bg-[#ffffff] rounded-xl transition-all duration-300">
      <div className="h-full shadow-xl rounded-xl">
        <div className="min-w-full px-3  shadow-md rounded-lg">
          <HolidayTable />
        </div>
      </div>
    </div>
  );
};

export default Holiday;
