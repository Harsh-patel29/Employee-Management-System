import React from 'react';
import { useSelector } from 'react-redux';
import ProjectTable from '../Components/ProjectTable.jsx';

const Attendance = () => {
  return (
    <div className="flex bg-[#ffffff] rounded-xl justify-center xl:w-[100%] xl:ml-30 mr-1.5 lg:w-[100%]  md:w-[90%]  sm:w-[88%] sm:ml-20 max-sm:w-[86%] transition-all duration-300">
      <div className="lg:w-[100%] md:w-[100%] sm:w-[100%] max-sm:w-[100%] h-full shadow-xl rounded-xl">
        <div className="overflow-x-auto shadow-md rounded-lg">
          <ProjectTable />
        </div>
      </div>
    </div>
  );
};

export default Attendance;
