import React from 'react';
import SalaryTable from '../Components/SalaryTable.jsx';

const Salary = () => {
  return (
    <div className="bg-[#ffffff] rounded-t-xl transition-all duration-300">
      <div className="h-full shadow-xl">
        <div className="min-w-full px-3 overflow-x-auto shadow-md rounded-lg">
          <SalaryTable />
        </div>
      </div>
    </div>
  );
};

export default Salary;
