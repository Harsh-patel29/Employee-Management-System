import { createRoot } from 'react-dom/client';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router';
import App from './App.jsx';
import { Provider } from 'react-redux';
import store from '../src/app/store.js';
import Login from './pages/Login.jsx';
import DashBoard from './pages/DashBoard.jsx';
import Users from './pages/Users.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import Settings from './pages/Settings.jsx';
import Master from './pages/Master.jsx';
import Roles from './pages/Roles.jsx';
import Leave from './pages/Leave.jsx';
import Attendance from './pages/Attendance.jsx';
import Project from './pages/Project.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import Task from './pages/Task.jsx';
import NewRoles from './pages/NewRoles.jsx';
import TaskUpdate from './pages/TaskUpdate.jsx';
import CreateLeave from './pages/CreateLeave.jsx';
import Regularization from './pages/Regularization.jsx';
import MonthlyReport from './pages/MonthlyReport.jsx';
import LeaveApprove from './pages/LeaveApprove.jsx';
import TaskTimerPage from './pages/TaskTimerPage.jsx';
import Holiday from './pages/Holiday.jsx';
import WeekOff from './pages/Weekoff.jsx';
import MissedPunchRegularization from './pages/MissedPunchRegularization.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import UnauthorizedPage from './pages/Unauthorized.jsx';
import Salary from './pages/Salaray.jsx';
import EmployeeSalary from './pages/EmployeeSalaryPage.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<App />}>
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/users" element={<Users />}>
            <Route path="/users/:id" element={<Users />} />
          </Route>
          <Route path="/EmpSalary" element={<EmployeeSalary />} />
          <Route path="/users/roles" element={<Roles />}>
            <Route path="/users/roles/:id" element={<Roles />} />
            <Route path="/users/roles/delete/:id" element={<Roles />} />
          </Route>
          <Route path="/create/roles" element={<NewRoles />} />
          <Route path="/update/roles/:id" element={<NewRoles />} />
          <Route path="/master" element={<Master />}>
            <Route path="/master/holiday" element={<Holiday />} />
            <Route path="/master/weekoff" element={<WeekOff />} />
            <Route path="/master/salary" element={<Salary />} />
          </Route>
          <Route path="/settings" element={<Settings />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route
            path="attendance/regularization"
            element={
              <ProtectedRoute>
                <Regularization />
              </ProtectedRoute>
            }
          />

          <Route
            path="attendance/monthlyReport"
            element={
              <ProtectedRoute>
                <MonthlyReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="attendance/missedPunchRegularization"
            element={<MissedPunchRegularization />}
          />
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
            <Route path="/productivity/tasks/delete/:id" element={<Task />} />
          </Route>
          <Route path="/productivity/tasks/:id" element={<TaskUpdate />} />
          <Route path="/productivity/tasktimer" element={<TaskTimerPage />} />
          <Route path="/leave" element={<Leave />} />
          <Route path="/leave/leaveType" element={<CreateLeave />} />
          <Route
            path="/leave/leaveApprove"
            element={
              <ProtectedRoute>
                <LeaveApprove />
              </ProtectedRoute>
            }
          />
        </Route>
      </Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/forgotPassword" element={<ForgotPassword />}></Route>
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
    </>
  )
);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
