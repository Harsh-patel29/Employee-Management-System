import React from 'react';
import { useSelector } from 'react-redux';
import TaskTable from '../Components/TaskTable.jsx';
const Task = () => {
  return (
    <div className="bg-[#ffffff] rounded-xl h-full  transition-all duration-300">
      <div className="lg:w-[100%] md:w-[100%] sm:w-[100%] max-sm:w-[100%] h-full shadow-xl rounded-xl">
        <div className="overflow-x-auto shadow-md rounded-lg px-2 min-w-full">
          <TaskTable />
        </div>
      </div>
    </div>
  );
};

export default Task;
