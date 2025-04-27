import React from 'react';
import WeekOffTable from '../Components/WeekOffTable';
const WeekOff = () => {
  return (
    <div className="h-full shadow-xl rounded-xl">
      <div className="w-full px-3 min-w-full shadow-md rounded-lg">
        <WeekOffTable />
      </div>
    </div>
  );
};

export default WeekOff;
