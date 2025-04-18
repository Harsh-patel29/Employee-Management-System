import React from 'react';
import WeekOffTable from '../Components/WeekOffTable';
const WeekOff = () => {
  return (
    <div className="lg:w-[100%] md:w-[100%] sm:w-[100%] max-sm:w-[100%] h-full shadow-xl rounded-xl">
      <div className="overflow-x-auto shadow-md rounded-lg">
        <WeekOffTable />
      </div>
    </div>
  );
};

export default WeekOff;
