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
import Roles from "./pages/Roles.jsx";
import Leave from "./pages/Leave.jsx";
import Attendance from "./pages/Attendance.jsx";
import Project from "./pages/Project.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import Task from "./pages/Task.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<App />}>
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<Users />} />
          <Route path="/users/roles" element={<Roles />} />
          <Route path="/users/roles/:id" element={<Roles />} />
          <Route path="/master" element={<Master />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/productivity/project" element={<Project />}>
            <Route
              path="/productivity/project/delete/:id"
              element={<Project />}
            />
            <Route
              path="/productivity/project/update/:id"
              element={<Project />}
            />
          </Route>
          <Route path="/productivity/project/:id" element={<ProjectDetail />} />
          <Route
            path="/productivity/project/:id/:userId/:roleId"
            element={<ProjectDetail />}
          />
          <Route path="/productivity/tasks" element={<Task />}>
            <Route path="productivity/tasks/:id" element={<Task />} />
          </Route>
          <Route path="/leave" element={<Leave />} />
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
