import { Outlet } from "react-router-dom";
import Navigation from "./pages/Navigation";
import "../src/index.css";
import NavBar from "./pages/NavBar";
import { useSelector } from "react-redux";
function App() {
  const theme = useSelector((state) => state.theme.theme);
  return (
    <>
      <div
        className={
          theme === "dark" ? "bg-[#121212] text-white" : "bg-white text-black"
        }
      >
        <main className="h-screen ">
          <NavBar />
          <Outlet />
          <Navigation />
        </main>
      </div>
    </>
  );
}

export default App;
