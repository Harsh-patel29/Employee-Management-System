import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './pages/Navigation';
import NavBar from './pages/NavBar';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from './Components/Loader.jsx';
import AttendanceShortcut from './pages/AttendanceShortcut';
import MarkAttendance from './Components/MarkAttendance';
import TaskTimer from './Components/TaskTimer';
import './scrollbar.css';
import '../src/index.css';
function App() {
  const isExpanded = useSelector((state) => state.Sidebar.isExpanded);
  const isVisible = useSelector((state) => state.Sidebar.visible);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      document.body.classList.remove('loading');
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <div className="min-h-screen grid grid-rows-[auto_1fr]">
        <header>
          <ToastContainer />
          <NavBar />
          <div className="flex space-x-2 p-2 ">
            <AttendanceShortcut />
            <MarkAttendance />
            <TaskTimer />
          </div>
        </header>
        <div
          className={`grid transition-all duration-500 ${isVisible ? 'grid-cols-[auto_1fr]' : ''}`}
        >
          <aside
            className={`transition-all duration-600 bg-gray-100 overflow-hidden ${isVisible ? '' : 'hidden'} ${isExpanded ? 'w-64' : 'w-29'}`}
          >
            <Navigation />
          </aside>
          <div className="container @container mx-auto mt-20 ">
            <main className={`${isExpanded ? 'ml-9' : ''}   overflow-auto`}>
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
