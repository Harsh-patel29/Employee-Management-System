import React from 'react';
import CreateLeaveTable from '../Components/CreateLeaveTable';
const CreateLeave = () => {
  return (
    <div className="bg-[#ffffff] rounded-xl  transition-all duration-300">
      <div className=" h-full shadow-xl rounded-xl">
        <div className="min-w-full px-2 overflow-x-auto shadow-md rounded-lg">
          <CreateLeaveTable />
        </div>
      </div>
    </div>
  );
};

export default CreateLeave;
