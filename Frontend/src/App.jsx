import { Outlet } from "react-router-dom";
import Navigation from "./pages/Navigation";
import "../src/index.css";
import NavBar from "./pages/NavBar";
import DashBoard from "./pages/DashBoard";
import { useSelector } from "react-redux";
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
        <main>
          <Outlet />
          <NavBar />
          <Navigation />
        </main>
      </div>
    </>
  );
}

export default App;
