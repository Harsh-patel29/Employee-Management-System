import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./pages/Navigation";
import "../src/index.css";
import NavBar from "./pages/NavBar";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./Components/Loader.jsx";
import "./scrollbar.css";
import AttendanceShortcut from "./pages/AttendanceShortcut";
import MarkAttendance from "./Components/MarkAttendance";
function App() {

  const isExpanded = useSelector((state) => state.Sidebar.isExpanded);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      document.body.classList.remove("loading");
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <ToastContainer />
      <div>
        <NavBar />
        <AttendanceShortcut />
        <MarkAttendance />
        <div className="flex ">
          <Navigation />
          <main
            className={`${
              isExpanded ? "ml-42 overflow-hidden " : ""
            } transition-all duration-600 flex w-full h-full justify-center mt-5`}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
