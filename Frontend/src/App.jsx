import { Outlet } from "react-router-dom";
import Navigation from "./pages/Navigation";
import "../src/index.css";
import NavBar from "./pages/NavBar";
import DashBoard from "./pages/DashBoard";

function App() {
  return (
    <>
      <NavBar />
      <Navigation />
      <DashBoard />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;
