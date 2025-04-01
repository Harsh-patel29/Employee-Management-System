import React from "react";
import { useSelector } from "react-redux";
import ProjectTable from "../Components/ProjectTable.jsx";

const Attendance = () => {
  const isExpanded = useSelector((state) => state.Sidebar.isExpanded);

  return (
    <div
      className={`${
        isExpanded
          ? "xl:ml-35 xl:w-[1500px] lg:scale-x-85  md:scale-x-80 sm:scale-x-70"
          : ""
      }
        flex items-start mt-[4.5%] rounded-xl justify-center xl:w-[92%] xl:ml-30 lg:w-[94.2%]  md:w-[90%] md:ml-20 sm:w-[88%] sm:ml-20 max-sm:w-[86%] transition-all duration-300`}
    >
      <div className="lg:w-[92%] md:w-[100%] sm:w-[100%] max-sm:w-[100%] h-full shadow-xl rounded-xl">
        <div className="overflow-x-auto shadow-md rounded-lg">
          <ProjectTable />
        </div>
      </div>
    </div>
  );
};

export default Attendance;
