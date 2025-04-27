import React from 'react';
import LeaveApproveTable from '../Components/LeaveApproveTable';
const LeaveApprove = () => {
  return (
    <div className="bg-[#ffffff] rounded-xl transition-all duration-300">
      <div className="h-full shadow-xl rounded-xl">
        <div className="min-w-full px-3 overflow-x-auto shadow-md rounded-lg">
          <LeaveApproveTable />
        </div>
      </div>
    </div>
  );
};

export default LeaveApprove;
