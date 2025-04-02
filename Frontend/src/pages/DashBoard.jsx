import React from "react";
import { useSelector } from "react-redux";

const DashBoard = () => {
  return (
    <div className=" flex bg-[#ffffff] rounded-xl justify-center xl:w-[100%] xl:ml-30 mr-1.5 lg:w-[100%]  md:w-[90%]  sm:w-[88%] sm:ml-20 max-sm:w-[86%] transition-all duration-300">
      <div className="max-sm:flex max-sm:justify-center flex">
        <div className="">
          <h5 className="text-[20.8px] font-[Inter,sans-serif] font-[600] md:mt-2 sm:mt-2 max-sm:mt-2 sm:flex ">
            OverView
          </h5>
        </div>
        <div className=" flex flex-wrap justify-center gap-6 p-10 lg:mt-8 md:mt-6 sm:mt-6 max-sm:mt-6 sm:w-[100%]">
          <div className="bg-[#e5fef16b] border-l-[5px] border-[#2ade879c] min-w-[256px]  flex items-center justify-center h-25 shadow-xl  rounded-xl">
            <div class=" flex flex-col items-center transition-transform duration-300 hover:scale-120">
              <h3 className="font-bold text-xl">Total Projects</h3>
              <p className="text-[#2cdb86cd] font-semibold">12</p>
            </div>
          </div>
          <div className="bg-[#feeddd55] border-l-[5px] border-[#f492379c] min-w-[256px]  flex items-center justify-center h-25 shadow-xl rounded-xl">
            <div className="flex flex-col items-center transition-transform duration-300 hover:scale-120">
              <h3 className="font-bold text-xl">On Going Task</h3>
              <p className="text-[#dc832fc5] font-semibold">00</p>
            </div>
          </div>
          <div className="bg-[#fadede57] border-l-[5px] border-[#ff36368c] min-w-[256px]  flex items-center justify-center h-25 shadow-xl rounded-xl">
            <div class=" flex flex-col items-center transition-transform duration-300 hover:scale-120">
              <h3 className="font-bold text-xl">Overdue Task</h3>
              <p class="text-[#d73737ad] font-semibold">24</p>
            </div>
          </div>
          <div className="bg-[#ddffff5f] border-l-[5px] border-[#22c2c28a] min-w-[256px]  flex items-center justify-center h-25 shadow-xl rounded-xl">
            <div class=" flex flex-col items-center transition-transform duration-300 hover:scale-120">
              <h3 className="font-bold text-xl">Due Today Task</h3>
              <p className="text-[#22c2c2bf]">11</p>
            </div>
          </div>{" "}
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
