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

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<App />}>
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<Users />} />
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
