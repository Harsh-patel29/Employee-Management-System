import React from 'react';
import RegularizationTable from '../Components/RegulariztionTable.jsx';
const Regularization = () => {
  return (
    <div className="bg-[#ffffff] rounded-t-xl  transition-all duration-300">
      <div className=" h-full shadow-xl">
        <div className="min-w-full px-3 overflow-x-auto shadow-md rounded-lg">
          <RegularizationTable />
        </div>
      </div>
    </div>
  );
};

export default Regularization;
