import React from 'react';
import TaskTimerTable from '../Components/TaskTimerTable';
const TaskTimerPage = () => {
  return (
    <div className="bg-[#ffffff] rounded-t-xl transition-all duration-300">
      <div className=" h-full shadow-xl ">
        <div className="min-w-full px-2 overflow-x-auto rounded-lg shadow-md ">
          <TaskTimerTable />
        </div>
      </div>
    </div>
  );
};
export default TaskTimerPage;
