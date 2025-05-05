import React from 'react';
import MissedPunchRegularizationTable from '../Components/MissedPunchRegularizationTable.jsx';
const MissedPunchRegularization = () => {
  return (
    <div className="bg-[#ffffff] rounded-t-xl transition-all duration-300">
      <div className="h-full shadow-xl">
        <div className="min-w-full px-3 overflow-x-auto shadow-md rounded-lg">
          <MissedPunchRegularizationTable />
        </div>
      </div>
    </div>
  );
};

export default MissedPunchRegularization;
