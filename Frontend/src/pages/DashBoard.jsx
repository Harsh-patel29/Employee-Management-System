import React from "react";
import { useSelector } from "react-redux";

const DashBoard = () => {
  const isExpanded = useSelector((state) => state.Sidebar.isExpanded);

  return (
    <div
      className={`absolute rounded-md lg:ml-30 md:ml-25 sm:ml-30 mt-20 w-[92%] shadow bg-[#fff] h-[50%] min-w-0  max-sm:h-[80%] sm:w-[80%] sm:h-[80%]  transition-all duration-300 ${
        isExpanded
          ? "xl:scale-x-90 xl:left-15 xl:right-10 lg:scale-x-90   md:scale-x-80 sm:scale-x-80 "
          : "xl:scale-x-100 xl:left-2 lg:scale-x-100 lg:left-10 md:scale-x-100 sm:scale-x-100 "
      }
        `}
    >
      <div className="xl:mb-2 xl:ml-6 max-sm:flex max-sm:justify-center ">
        <h1 className="text-2xl font-bold md:ml-6 md:mt-2 sm:mt-2 max-sm:mt-2  sm:flex sm:items-center sm:justify-center">
          OverView
        </h1>
      </div>
      <div className=" flex flex-wrap justify-center gap-6 items-center h-[40%] xl:mt-2 lg:mt-8 md:mt-6 sm:mt-6 max-sm:mt-6 sm:w-[100%]">
        <div className="bg-[#e5fef16b] border-l-[5px] border-[#2ade879c] min-w-[256px]  flex items-center justify-center h-[90px] rounded-xl">
          <div class=" flex flex-col items-center transition-transform duration-300 hover:scale-120">
            <h3 className="font-bold text-xl">Total Projects</h3>
            <p className="text-[#2cdb86cd] font-semibold">12</p>
          </div>
        </div>
        <div className="bg-[#feeddd55] border-l-[5px] border-[#f492379c] min-w-[256px]  flex items-center justify-center h-[90px] rounded-xl">
          <div className="flex flex-col items-center transition-transform duration-300 hover:scale-120">
            <h3 className="font-bold text-xl">On Going Task</h3>
            <p className="text-[#dc832fc5] font-semibold">00</p>
          </div>
        </div>
        <div className="bg-[#fadede57] border-l-[5px] border-[#ff36368c] min-w-[256px]  flex items-center justify-center h-[90px] rounded-xl">
          <div class=" flex flex-col items-center transition-transform duration-300 hover:scale-120">
            <h3 className="font-bold text-xl">Overdue Task</h3>
            <p class="text-[#d73737ad] font-semibold">24</p>
          </div>
        </div>
        <div className="bg-[#ddffff5f] border-l-[5px] border-[#22c2c28a] min-w-[256px]  flex items-center justify-center h-[90px] rounded-xl">
          <div class=" flex flex-col items-center transition-transform duration-300 hover:scale-120">
            <h3 className="font-bold text-xl">Due Today Task</h3>
            <p className="text-[#22c2c2bf]">11</p>
          </div>{" "}
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
