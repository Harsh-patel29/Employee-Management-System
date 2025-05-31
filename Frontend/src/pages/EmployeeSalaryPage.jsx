import React from 'react';
import EmployeeSalaryTable from '../Components/EmployeeSalaryTable';
const EmployeeSalary = () => {
  return (
    <div className="bg-[#ffffff] rounded-t-xl  transition-all duration-300">
      <div className=" h-full shadow-xl">
        <div className="min-w-full px-2 overflow-x-auto shadow-md rounded-lg">
          <EmployeeSalaryTable />
        </div>
      </div>
    </div>
  );
};

export default EmployeeSalary;
