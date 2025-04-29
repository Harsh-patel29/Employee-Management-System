import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CollapsibleTable from '../Components/Table.jsx';
const Users = () => {
  return (
    <div className="bg-[#ffffff] rounded-t-xl  transition-all duration-300">
      <div className=" h-full shadow-xl ">
        <div className="min-w-full px-3 overflow-x-auto shadow-md rounded-lg">
          <CollapsibleTable />
        </div>
      </div>
    </div>
  );
};

export default Users;
