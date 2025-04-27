import React from 'react';
import TaskTimerTable from '../Components/TaskTimerTable';
const TaskTimerPage = () => {
  return (
    <div className="bg-[#ffffff] rounded-xl  transition-all duration-300">
      <div className=" h-full shadow-xl rounded-xl">
        <div className="min-w-full px-2 overflow-x-auto shadow-md rounded-lg">
          <TaskTimerTable />
        </div>
      </div>
    </div>
  );
};
export default TaskTimerPage;
