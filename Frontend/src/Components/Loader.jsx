import React from 'react';
import { RotatingLines } from 'react-loader-spinner';

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen ">
      <RotatingLines
        height={80}
        width={80}
        strokeWidth={2}
        strokeWidthSecondary={2}
        strokeColor="#408cb6"
        ariaLabel="loading"
      />
    </div>
  );
};

export default Loader;
