import React from "react";

const DashBoard = () => {
  return (
    <div className="flex absolute mt-32 ml-28 shadow-xl w-[84rem] h-[18rem] border rounded-md ">
      <div className="mt-2 ml-2">
        <h1 className="text-4xl">OverView</h1>
      </div>
      <div className="flex shrink items-center mb-10 ml-30 w-full">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-20 ">
          <div class="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg shadow-md flex flex-col items-center transition-transform duration-300 hover:scale-120">
            <h3 class="text-gray-800 font-semibold">Total Projects</h3>
            <p class="text-green-500 text-xl font-semibold">12</p>
          </div>
          <div class="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-lg shadow-md flex flex-col items-center transition-transform duration-300 hover:scale-120">
            <h3 class="text-gray-800 font-semibold">On Going Task</h3>
            <p class="text-orange-500 text-xl font-semibold">00</p>
          </div>
          <div class="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg shadow-md flex flex-col items-center transition-transform duration-300 hover:scale-120">
            <h3 class="text-gray-800 font-semibold">Overdue Task</h3>
            <p class="text-red-500 text-xl font-semibold">24</p>
          </div>
          <div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg shadow-md flex flex-col items-center transition-transform duration-300 hover:scale-120">
            <h3 class="text-gray-800 font-semibold">Due Today Task</h3>
            <p class="text-blue-500 text-xl font-semibold">11</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
