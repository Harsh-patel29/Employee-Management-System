import React from 'react';
import MonthlyReportTable from '../Components/MonthlyReportTable';
const MonthlyReport = () => {
  return (
    <div className="bg-[#ffffff] rounded-t-xl  transition-all duration-300">
      <div className=" h-full shadow-xl">
        <div className="min-w-full px-3 overflow-x-auto shadow-md rounded-lg">
          <MonthlyReportTable />
        </div>
      </div>
    </div>
  );
};

export default MonthlyReport;
