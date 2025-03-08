import { createRoot } from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "../src/app/store.js";
import Login from "./pages/Login.jsx";
import DashBoard from "./pages/DashBoard.jsx";
import Users from "./pages/Users.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import Settings from "./pages/Settings.jsx";
import Master from "./pages/Master.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<App />}>
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<Users />} />
          <Route path="/master" element={<Master />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/:id" element={<Settings />} />
        </Route>
      </Route>
      <Route path="/login" element={<Login />}></Route>
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
