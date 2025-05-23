import React from 'react';
import { useDispatch } from 'react-redux';
import { openAttendanceSheet } from '../feature/attendancefetch/attendanceSlice';

function AttendanceShortcut() {
  const dispatch = useDispatch();

  return (
    <div className="flex justify-end h-10 w-10 right-0 fixed bottom-110 z-50">
      <div className="flex h-auto w-auto justify-center items-center p-0">
        <button
          className="bg-white border-[rgb(120,173,196)] border-l-2  border-t-2 border-b-2 rounded cursor-pointer"
          onClick={() => dispatch(openAttendanceSheet())}
        >
          <svg
            className="text-[rgb(120,173,196)] w-7 h-7"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke-linecap="round"
            stroke-linejoin="round"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2"></path>
            <path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default AttendanceShortcut;
