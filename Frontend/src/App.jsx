import { Outlet } from "react-router-dom";
import Navigation from "./pages/Navigation";
import "../src/index.css";
import NavBar from "./pages/NavBar";
import DashBoard from "./pages/DashBoard";
import { useSelector } from "react-redux";
function App() {
  const theme = useSelector((state) => state.theme.theme);
  const isExpanded = useSelector((state) => state.Sidebar.isExpanded);
  return (
    <>
      <div
        className={
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
        }
      >
        <main className="p-0 m-0 h-[756px]">
          <NavBar />
          <Outlet />
          <Navigation />
        </main>
      </div>
    </>
  );
}

export default App;
