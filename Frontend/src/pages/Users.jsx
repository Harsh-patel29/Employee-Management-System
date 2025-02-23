import React from "react";
import { useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import CollapsibleTable from "../Components/Table.jsx";
const Users = () => {
  const isExpanded = useSelector((state) => state.Sidebar.isExpanded);

  return (
    <div
      className={`
        
        ${
          isExpanded
            ? "xl:scale-x-95 xl:left-8 lg:scale-x-85  md:scale-x-80 sm:scale-x-70"
            : "scale-x-100 "
        }
        flex items-start mt-20 absolute bg-white/20 rounded-xl justify-center xl:w-[92%] xl:ml-17 lg:w-[94.2%] lg:ml-16 md:w-[90%] md:ml-20 sm:w-[88%] sm:ml-20 max-sm:w-[86%] transition-all duration-300`}
    >
      <div className=" lg:w-[92%] md:w-[100%] sm:w-[100%] max-sm:w-[100%] h-full shadow-xl rounded-xl  ">
        <div className="overflow-x-auto bg-white shadow-md  rounded-lg ">
          <CollapsibleTable />
        </div>
      </div>
    </div>
  );
};

export default Users;
