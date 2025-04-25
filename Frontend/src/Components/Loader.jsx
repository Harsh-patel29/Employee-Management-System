import React from 'react';
import { RotatingLines } from 'react-loader-spinner';

const Loader = ({ height = 80, width = 80 }) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <RotatingLines
        height={height}
        width={width}
        strokeWidth={2}
        strokeWidthSecondary={6}
        strokeColor="#408cb6"
        ariaLabel="loading"
      />
    </div>
  );
};

export default Loader;
