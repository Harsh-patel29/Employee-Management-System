import { Outlet } from "react-router-dom";
import Navigation from "./pages/Navigation";
import "../src/index.css";
import NavBar from "./pages/NavBar";
import DashBoard from "./pages/DashBoard";
import { useSelector } from "react-redux";
import ThemeToggle from "./Components/ThemeToggle";
function App() {
  const theme = useSelector((state) => state.theme.theme);
  return (
    <>
      <div
        className={
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
        }
        style={{ height: "100vh" }}
      >
        <NavBar />
        <Navigation />
        <DashBoard />
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default App;
