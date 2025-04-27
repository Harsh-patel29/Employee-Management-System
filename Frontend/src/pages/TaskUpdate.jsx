import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TaskUpdateForm from '../Components/TaskForm.jsx';
const TaskUpdate = () => {
  return (
    <div className="bg-[#ffffff] rounded-xl  transition-all duration-300">
      <div className=" h-full shadow-xl rounded-xl ">
        <div className="min-w-full px-3 overflow-x-auto  shadow-md rounded-lg">
          <TaskUpdateForm />
        </div>
      </div>
    </div>
  );
};

export default TaskUpdate;
