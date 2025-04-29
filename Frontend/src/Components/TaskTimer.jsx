import React, { useState, useEffect } from 'react';
import Timer from './Timer';
import { useDispatch, useSelector } from 'react-redux';
import { getTaskByUser } from '../feature/tasktimerfetch/tasktimerslice.js';

const TaskTimer = () => {
  const dispatch = useDispatch();
  const [openTimer, setOpenTimer] = useState(false);
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="fixed bottom-2 right-2 m-4">
      <button
        onClick={() => {
          setOpenTimer(true);
          dispatch(getTaskByUser({ user: user.Name }));
        }}
        className="bg-transparent border-[rgb(120,173,196)] border-2 text-white p-2 rounded-full flex items-center justify-center cursor-pointer"
      >
        <svg
          stroke="currentColor"
          fill="rgb(120,173,196)"
          stroke-width="0"
          viewBox="0 0 24 24"
          class="timer"
          height="2em"
          width="2em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42A8.962 8.962 0 0012 4c-4.97 0-9 4.03-9 9s4.02 9 9 9a8.994 8.994 0 007.03-14.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"></path>
        </svg>
      </button>
      <Timer openTimer={openTimer} setOpenTimer={setOpenTimer} />
    </div>
  );
};

export default TaskTimer;
