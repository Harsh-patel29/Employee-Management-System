import React from 'react';
import ProjectTable from '../Components/ProjectTable.jsx';

const Attendance = () => {
  return (
    <div className="bg-[#ffffff] rounded-t-xl h-full  transition-all duration-300">
      <div className="h-full shadow-xl">
        <div className="overflow-x-auto shadow-md rounded-lg w-full px-2">
          <ProjectTable />
        </div>
      </div>
    </div>
  );
};

export default Attendance;
