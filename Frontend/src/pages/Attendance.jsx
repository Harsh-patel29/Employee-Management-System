import React from 'react';
import { useSelector } from 'react-redux';
import AttendanceTable from '../Components/AttendanceTable.jsx';

const Attendance = () => {
  return (
    <div className="bg-[#ffffff] rounded-t-xl  transition-all duration-300">
      <div className=" h-full shadow-xl">
        <div className="min-w-full px-2 overflow-x-auto shadow-md rounded-lg">
          <AttendanceTable />
        </div>
      </div>
    </div>
  );
};

export default Attendance;
