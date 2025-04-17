import React from 'react';
import HolidayTable from '../Components/HolidayTable.jsx';
const Holiday = () => {
  return (
    <div className="lg:w-[100%] md:w-[100%] sm:w-[100%] max-sm:w-[100%] h-full shadow-xl rounded-xl">
      <div className="overflow-x-auto shadow-md rounded-lg">
        <HolidayTable />
      </div>
    </div>
  );
};

export default Holiday;
