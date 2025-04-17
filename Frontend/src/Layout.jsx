import React from 'react';
import NavBar from '../pages/NavBar';
import Navigation from '../pages/Navigation';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const theme = useSelector((state) => state.theme.theme);

  return (
    <div
      className={`${
        theme === 'dark' ? 'bg-[#121212] text-white' : 'bg-white text-black'
      }`}
    >
      <NavBar />
      <div className="flex">
        <Navigation />
        <main className="ml-[250px] w-full p-4">
          {' '}
          {/* Adjust margin-left for Navigation */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
