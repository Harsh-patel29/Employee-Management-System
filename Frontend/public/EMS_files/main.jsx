import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=e73464ce"; const Fragment = __vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_reactDom_client from "/node_modules/.vite/deps/react-dom_client.js?v=e73464ce"; const createRoot = __vite__cjsImport1_reactDom_client["createRoot"];
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements
} from "/node_modules/.vite/deps/react-router.js?v=e73464ce";
import App from "/src/App.jsx?t=1747730556308";
import { Provider } from "/node_modules/.vite/deps/react-redux.js?v=e73464ce";
import store from "/src/app/store.js";
import Login from "/src/pages/Login.jsx";
import DashBoard from "/src/pages/DashBoard.jsx";
import Users from "/src/pages/Users.jsx";
import PrivateRoute from "/src/PrivateRoute.jsx";
import Settings from "/src/pages/Settings.jsx";
import Master from "/src/pages/Master.jsx";
import Roles from "/src/pages/Roles.jsx";
import Leave from "/src/pages/Leave.jsx";
import Attendance from "/src/pages/Attendance.jsx";
import Project from "/src/pages/Project.jsx";
import ProjectDetail from "/src/pages/ProjectDetail.jsx";
import Task from "/src/pages/Task.jsx?t=1747730556308";
import NewRoles from "/src/pages/NewRoles.jsx";
import TaskUpdate from "/src/pages/TaskUpdate.jsx?t=1747730556308";
import CreateLeave from "/src/pages/CreateLeave.jsx";
import Regularization from "/src/pages/Regularization.jsx";
import MonthlyReport from "/src/pages/MonthlyReport.jsx";
import LeaveApprove from "/src/pages/LeaveApprove.jsx";
import TaskTimerPage from "/src/pages/TaskTimerPage.jsx";
import Holiday from "/src/pages/Holiday.jsx";
import WeekOff from "/src/pages/Weekoff.jsx";
import MissedPunchRegularization from "/src/pages/MissedPunchRegularization.jsx";
import ForgotPassword from "/src/pages/ForgotPassword.jsx";
const router = createBrowserRouter(
  createRoutesFromElements(
    /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV(Route, { element: /* @__PURE__ */ jsxDEV(PrivateRoute, {}, void 0, false, {
        fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
        lineNumber: 38,
        columnNumber: 23
      }, this), children: /* @__PURE__ */ jsxDEV(Route, { path: "/", element: /* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
        fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
        lineNumber: 39,
        columnNumber: 34
      }, this), children: [
        /* @__PURE__ */ jsxDEV(Route, { path: "/dashboard", element: /* @__PURE__ */ jsxDEV(DashBoard, {}, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 40,
          columnNumber: 45
        }, this) }, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 40,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "/users", element: /* @__PURE__ */ jsxDEV(Users, {}, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 41,
          columnNumber: 41
        }, this), children: /* @__PURE__ */ jsxDEV(Route, { path: "/users/:id", element: /* @__PURE__ */ jsxDEV(Users, {}, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 42,
          columnNumber: 47
        }, this) }, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 42,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 41,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "/users/roles", element: /* @__PURE__ */ jsxDEV(Roles, {}, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 44,
          columnNumber: 47
        }, this), children: [
          /* @__PURE__ */ jsxDEV(Route, { path: "/users/roles/:id", element: /* @__PURE__ */ jsxDEV(Roles, {}, void 0, false, {
            fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
            lineNumber: 45,
            columnNumber: 53
          }, this) }, void 0, false, {
            fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
            lineNumber: 45,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(Route, { path: "/users/roles/delete/:id", element: /* @__PURE__ */ jsxDEV(Roles, {}, void 0, false, {
            fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
            lineNumber: 46,
            columnNumber: 60
          }, this) }, void 0, false, {
            fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
            lineNumber: 46,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 44,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "/create/roles", element: /* @__PURE__ */ jsxDEV(NewRoles, {}, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 48,
          columnNumber: 48
        }, this) }, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 48,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "/update/roles/:id", element: /* @__PURE__ */ jsxDEV(NewRoles, {}, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 49,
          columnNumber: 52
        }, this) }, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 49,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "/master", element: /* @__PURE__ */ jsxDEV(Master, {}, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 50,
          columnNumber: 42
        }, this), children: [
          /* @__PURE__ */ jsxDEV(Route, { path: "/master/holiday", element: /* @__PURE__ */ jsxDEV(Holiday, {}, void 0, false, {
            fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
            lineNumber: 51,
            columnNumber: 52
          }, this) }, void 0, false, {
            fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
            lineNumber: 51,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(Route, { path: "/master/weekoff", element: /* @__PURE__ */ jsxDEV(WeekOff, {}, void 0, false, {
            fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
            lineNumber: 52,
            columnNumber: 52
          }, this) }, void 0, false, {
            fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
            lineNumber: 52,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 50,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "/settings", element: /* @__PURE__ */ jsxDEV(Settings, {}, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 54,
          columnNumber: 44
        }, this) }, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 54,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "/attendance", element: /* @__PURE__ */ jsxDEV(Attendance, {}, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 55,
          columnNumber: 46
        }, this) }, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 55,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          Route,
          {
            path: "attendance/regularization",
            element: /* @__PURE__ */ jsxDEV(Regularization, {}, void 0, false, {
              fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
              lineNumber: 58,
              columnNumber: 22
            }, this)
          },
          void 0,
          false,
          {
            fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
            lineNumber: 56,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(Route, { path: "attendance/monthlyReport", element: /* @__PURE__ */ jsxDEV(MonthlyReport, {}, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 60,
          columnNumber: 59
        }, this) }, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 60,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          Route,
          {
            path: "attendance/missedPunchRegularization",
            element: /* @__PURE__ */ jsxDEV(MissedPunchRegularization, {}, void 0, false, {
              fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
              lineNumber: 63,
              columnNumber: 22
            }, this)
          },
          void 0,
          false,
          {
            fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
            lineNumber: 61,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(Route, { path: "/productivity/project", element: /* @__PURE__ */ jsxDEV(Project, {}, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 65,
          columnNumber: 56
        }, this), children: [
          /* @__PURE__ */ jsxDEV(
            Route,
            {
              path: "/productivity/project/delete/:id",
              element: /* @__PURE__ */ jsxDEV(Project, {}, void 0, false, {
                fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
                lineNumber: 68,
                columnNumber: 24
              }, this)
            },
            void 0,
            false,
            {
              fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
              lineNumber: 66,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            Route,
            {
              path: "/productivity/project/update/:id",
              element: /* @__PURE__ */ jsxDEV(Project, {}, void 0, false, {
                fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
                lineNumber: 72,
                columnNumber: 24
              }, this)
            },
            void 0,
            false,
            {
              fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
              lineNumber: 70,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 65,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "/productivity/project/:id", element: /* @__PURE__ */ jsxDEV(ProjectDetail, {}, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 75,
          columnNumber: 60
        }, this) }, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 75,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          Route,
          {
            path: "/productivity/project/:id/:userId/:roleId",
            element: /* @__PURE__ */ jsxDEV(ProjectDetail, {}, void 0, false, {
              fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
              lineNumber: 78,
              columnNumber: 22
            }, this)
          },
          void 0,
          false,
          {
            fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
            lineNumber: 76,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(Route, { path: "/productivity/tasks", element: /* @__PURE__ */ jsxDEV(Task, {}, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 80,
          columnNumber: 54
        }, this), children: /* @__PURE__ */ jsxDEV(Route, { path: "/productivity/tasks/delete/:id", element: /* @__PURE__ */ jsxDEV(Task, {}, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 81,
          columnNumber: 67
        }, this) }, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 81,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 80,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "/productivity/tasks/:id", element: /* @__PURE__ */ jsxDEV(TaskUpdate, {}, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 83,
          columnNumber: 58
        }, this) }, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 83,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "/productivity/tasktimer", element: /* @__PURE__ */ jsxDEV(TaskTimerPage, {}, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 84,
          columnNumber: 58
        }, this) }, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 84,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "/leave", element: /* @__PURE__ */ jsxDEV(Leave, {}, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 85,
          columnNumber: 41
        }, this) }, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 85,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "/leave/leaveType", element: /* @__PURE__ */ jsxDEV(CreateLeave, {}, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 86,
          columnNumber: 51
        }, this) }, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 86,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "/leave/leaveApprove", element: /* @__PURE__ */ jsxDEV(LeaveApprove, {}, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 87,
          columnNumber: 54
        }, this) }, void 0, false, {
          fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
          lineNumber: 87,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
        lineNumber: 39,
        columnNumber: 9
      }, this) }, void 0, false, {
        fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
        lineNumber: 38,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ jsxDEV(Route, { path: "/login", element: /* @__PURE__ */ jsxDEV(Login, {}, void 0, false, {
        fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
        lineNumber: 90,
        columnNumber: 37
      }, this) }, void 0, false, {
        fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
        lineNumber: 90,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ jsxDEV(Route, { path: "/forgotPassword", element: /* @__PURE__ */ jsxDEV(ForgotPassword, {}, void 0, false, {
        fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
        lineNumber: 91,
        columnNumber: 46
      }, this) }, void 0, false, {
        fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
        lineNumber: 91,
        columnNumber: 7
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
      lineNumber: 37,
      columnNumber: 5
    }, this)
  )
);
createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxDEV(Provider, { store, children: /* @__PURE__ */ jsxDEV(RouterProvider, { router }, void 0, false, {
    fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
    lineNumber: 98,
    columnNumber: 5
  }, this) }, void 0, false, {
    fileName: "C:/Users/Harsh Patel/Programming/Project/Employee-Management-System/Frontend/src/main.jsx",
    lineNumber: 97,
    columnNumber: 3
  }, this)
);

//# sourceMappingURL=data:application/json;base64,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ZVJvb3QiLCJSb3V0ZSIsIlJvdXRlclByb3ZpZGVyIiwiY3JlYXRlQnJvd3NlclJvdXRlciIsImNyZWF0ZVJvdXRlc0Zyb21FbGVtZW50cyIsIkFwcCIsIlByb3ZpZGVyIiwic3RvcmUiLCJMb2dpbiIsIkRhc2hCb2FyZCIsIlVzZXJzIiwiUHJpdmF0ZVJvdXRlIiwiU2V0dGluZ3MiLCJNYXN0ZXIiLCJSb2xlcyIsIkxlYXZlIiwiQXR0ZW5kYW5jZSIsIlByb2plY3QiLCJQcm9qZWN0RGV0YWlsIiwiVGFzayIsIk5ld1JvbGVzIiwiVGFza1VwZGF0ZSIsIkNyZWF0ZUxlYXZlIiwiUmVndWxhcml6YXRpb24iLCJNb250aGx5UmVwb3J0IiwiTGVhdmVBcHByb3ZlIiwiVGFza1RpbWVyUGFnZSIsIkhvbGlkYXkiLCJXZWVrT2ZmIiwiTWlzc2VkUHVuY2hSZWd1bGFyaXphdGlvbiIsIkZvcmdvdFBhc3N3b3JkIiwicm91dGVyIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInJlbmRlciJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlcyI6WyJtYWluLmpzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVSb290IH0gZnJvbSAncmVhY3QtZG9tL2NsaWVudCc7XG5pbXBvcnQge1xuICBSb3V0ZSxcbiAgUm91dGVyUHJvdmlkZXIsXG4gIGNyZWF0ZUJyb3dzZXJSb3V0ZXIsXG4gIGNyZWF0ZVJvdXRlc0Zyb21FbGVtZW50cyxcbn0gZnJvbSAncmVhY3Qtcm91dGVyJztcbmltcG9ydCBBcHAgZnJvbSAnLi9BcHAuanN4JztcbmltcG9ydCB7IFByb3ZpZGVyIH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHN0b3JlIGZyb20gJy4uL3NyYy9hcHAvc3RvcmUuanMnO1xuaW1wb3J0IExvZ2luIGZyb20gJy4vcGFnZXMvTG9naW4uanN4JztcbmltcG9ydCBEYXNoQm9hcmQgZnJvbSAnLi9wYWdlcy9EYXNoQm9hcmQuanN4JztcbmltcG9ydCBVc2VycyBmcm9tICcuL3BhZ2VzL1VzZXJzLmpzeCc7XG5pbXBvcnQgUHJpdmF0ZVJvdXRlIGZyb20gJy4vUHJpdmF0ZVJvdXRlLmpzeCc7XG5pbXBvcnQgU2V0dGluZ3MgZnJvbSAnLi9wYWdlcy9TZXR0aW5ncy5qc3gnO1xuaW1wb3J0IE1hc3RlciBmcm9tICcuL3BhZ2VzL01hc3Rlci5qc3gnO1xuaW1wb3J0IFJvbGVzIGZyb20gJy4vcGFnZXMvUm9sZXMuanN4JztcbmltcG9ydCBMZWF2ZSBmcm9tICcuL3BhZ2VzL0xlYXZlLmpzeCc7XG5pbXBvcnQgQXR0ZW5kYW5jZSBmcm9tICcuL3BhZ2VzL0F0dGVuZGFuY2UuanN4JztcbmltcG9ydCBQcm9qZWN0IGZyb20gJy4vcGFnZXMvUHJvamVjdC5qc3gnO1xuaW1wb3J0IFByb2plY3REZXRhaWwgZnJvbSAnLi9wYWdlcy9Qcm9qZWN0RGV0YWlsLmpzeCc7XG5pbXBvcnQgVGFzayBmcm9tICcuL3BhZ2VzL1Rhc2suanN4JztcbmltcG9ydCBOZXdSb2xlcyBmcm9tICcuL3BhZ2VzL05ld1JvbGVzLmpzeCc7XG5pbXBvcnQgVGFza1VwZGF0ZSBmcm9tICcuL3BhZ2VzL1Rhc2tVcGRhdGUuanN4JztcbmltcG9ydCBDcmVhdGVMZWF2ZSBmcm9tICcuL3BhZ2VzL0NyZWF0ZUxlYXZlLmpzeCc7XG5pbXBvcnQgUmVndWxhcml6YXRpb24gZnJvbSAnLi9wYWdlcy9SZWd1bGFyaXphdGlvbi5qc3gnO1xuaW1wb3J0IE1vbnRobHlSZXBvcnQgZnJvbSAnLi9wYWdlcy9Nb250aGx5UmVwb3J0LmpzeCc7XG5pbXBvcnQgTGVhdmVBcHByb3ZlIGZyb20gJy4vcGFnZXMvTGVhdmVBcHByb3ZlLmpzeCc7XG5pbXBvcnQgVGFza1RpbWVyUGFnZSBmcm9tICcuL3BhZ2VzL1Rhc2tUaW1lclBhZ2UuanN4JztcbmltcG9ydCBIb2xpZGF5IGZyb20gJy4vcGFnZXMvSG9saWRheS5qc3gnO1xuaW1wb3J0IFdlZWtPZmYgZnJvbSAnLi9wYWdlcy9XZWVrb2ZmLmpzeCc7XG5pbXBvcnQgTWlzc2VkUHVuY2hSZWd1bGFyaXphdGlvbiBmcm9tICcuL3BhZ2VzL01pc3NlZFB1bmNoUmVndWxhcml6YXRpb24uanN4JztcbmltcG9ydCBGb3Jnb3RQYXNzd29yZCBmcm9tICcuL3BhZ2VzL0ZvcmdvdFBhc3N3b3JkLmpzeCc7XG5cbmNvbnN0IHJvdXRlciA9IGNyZWF0ZUJyb3dzZXJSb3V0ZXIoXG4gIGNyZWF0ZVJvdXRlc0Zyb21FbGVtZW50cyhcbiAgICA8PlxuICAgICAgPFJvdXRlIGVsZW1lbnQ9ezxQcml2YXRlUm91dGUgLz59PlxuICAgICAgICA8Um91dGUgcGF0aD1cIi9cIiBlbGVtZW50PXs8QXBwIC8+fT5cbiAgICAgICAgICA8Um91dGUgcGF0aD1cIi9kYXNoYm9hcmRcIiBlbGVtZW50PXs8RGFzaEJvYXJkIC8+fSAvPlxuICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiL3VzZXJzXCIgZWxlbWVudD17PFVzZXJzIC8+fT5cbiAgICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiL3VzZXJzLzppZFwiIGVsZW1lbnQ9ezxVc2VycyAvPn0gLz5cbiAgICAgICAgICA8L1JvdXRlPlxuICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiL3VzZXJzL3JvbGVzXCIgZWxlbWVudD17PFJvbGVzIC8+fT5cbiAgICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiL3VzZXJzL3JvbGVzLzppZFwiIGVsZW1lbnQ9ezxSb2xlcyAvPn0gLz5cbiAgICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiL3VzZXJzL3JvbGVzL2RlbGV0ZS86aWRcIiBlbGVtZW50PXs8Um9sZXMgLz59IC8+XG4gICAgICAgICAgPC9Sb3V0ZT5cbiAgICAgICAgICA8Um91dGUgcGF0aD1cIi9jcmVhdGUvcm9sZXNcIiBlbGVtZW50PXs8TmV3Um9sZXMgLz59IC8+XG4gICAgICAgICAgPFJvdXRlIHBhdGg9XCIvdXBkYXRlL3JvbGVzLzppZFwiIGVsZW1lbnQ9ezxOZXdSb2xlcyAvPn0gLz5cbiAgICAgICAgICA8Um91dGUgcGF0aD1cIi9tYXN0ZXJcIiBlbGVtZW50PXs8TWFzdGVyIC8+fT5cbiAgICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiL21hc3Rlci9ob2xpZGF5XCIgZWxlbWVudD17PEhvbGlkYXkgLz59IC8+XG4gICAgICAgICAgICA8Um91dGUgcGF0aD1cIi9tYXN0ZXIvd2Vla29mZlwiIGVsZW1lbnQ9ezxXZWVrT2ZmIC8+fSAvPlxuICAgICAgICAgIDwvUm91dGU+XG4gICAgICAgICAgPFJvdXRlIHBhdGg9XCIvc2V0dGluZ3NcIiBlbGVtZW50PXs8U2V0dGluZ3MgLz59IC8+XG4gICAgICAgICAgPFJvdXRlIHBhdGg9XCIvYXR0ZW5kYW5jZVwiIGVsZW1lbnQ9ezxBdHRlbmRhbmNlIC8+fSAvPlxuICAgICAgICAgIDxSb3V0ZVxuICAgICAgICAgICAgcGF0aD1cImF0dGVuZGFuY2UvcmVndWxhcml6YXRpb25cIlxuICAgICAgICAgICAgZWxlbWVudD17PFJlZ3VsYXJpemF0aW9uIC8+fVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFJvdXRlIHBhdGg9XCJhdHRlbmRhbmNlL21vbnRobHlSZXBvcnRcIiBlbGVtZW50PXs8TW9udGhseVJlcG9ydCAvPn0gLz5cbiAgICAgICAgICA8Um91dGVcbiAgICAgICAgICAgIHBhdGg9XCJhdHRlbmRhbmNlL21pc3NlZFB1bmNoUmVndWxhcml6YXRpb25cIlxuICAgICAgICAgICAgZWxlbWVudD17PE1pc3NlZFB1bmNoUmVndWxhcml6YXRpb24gLz59XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8Um91dGUgcGF0aD1cIi9wcm9kdWN0aXZpdHkvcHJvamVjdFwiIGVsZW1lbnQ9ezxQcm9qZWN0IC8+fT5cbiAgICAgICAgICAgIDxSb3V0ZVxuICAgICAgICAgICAgICBwYXRoPVwiL3Byb2R1Y3Rpdml0eS9wcm9qZWN0L2RlbGV0ZS86aWRcIlxuICAgICAgICAgICAgICBlbGVtZW50PXs8UHJvamVjdCAvPn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8Um91dGVcbiAgICAgICAgICAgICAgcGF0aD1cIi9wcm9kdWN0aXZpdHkvcHJvamVjdC91cGRhdGUvOmlkXCJcbiAgICAgICAgICAgICAgZWxlbWVudD17PFByb2plY3QgLz59XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvUm91dGU+XG4gICAgICAgICAgPFJvdXRlIHBhdGg9XCIvcHJvZHVjdGl2aXR5L3Byb2plY3QvOmlkXCIgZWxlbWVudD17PFByb2plY3REZXRhaWwgLz59IC8+XG4gICAgICAgICAgPFJvdXRlXG4gICAgICAgICAgICBwYXRoPVwiL3Byb2R1Y3Rpdml0eS9wcm9qZWN0LzppZC86dXNlcklkLzpyb2xlSWRcIlxuICAgICAgICAgICAgZWxlbWVudD17PFByb2plY3REZXRhaWwgLz59XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8Um91dGUgcGF0aD1cIi9wcm9kdWN0aXZpdHkvdGFza3NcIiBlbGVtZW50PXs8VGFzayAvPn0+XG4gICAgICAgICAgICA8Um91dGUgcGF0aD1cIi9wcm9kdWN0aXZpdHkvdGFza3MvZGVsZXRlLzppZFwiIGVsZW1lbnQ9ezxUYXNrIC8+fSAvPlxuICAgICAgICAgIDwvUm91dGU+XG4gICAgICAgICAgPFJvdXRlIHBhdGg9XCIvcHJvZHVjdGl2aXR5L3Rhc2tzLzppZFwiIGVsZW1lbnQ9ezxUYXNrVXBkYXRlIC8+fSAvPlxuICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiL3Byb2R1Y3Rpdml0eS90YXNrdGltZXJcIiBlbGVtZW50PXs8VGFza1RpbWVyUGFnZSAvPn0gLz5cbiAgICAgICAgICA8Um91dGUgcGF0aD1cIi9sZWF2ZVwiIGVsZW1lbnQ9ezxMZWF2ZSAvPn0gLz5cbiAgICAgICAgICA8Um91dGUgcGF0aD1cIi9sZWF2ZS9sZWF2ZVR5cGVcIiBlbGVtZW50PXs8Q3JlYXRlTGVhdmUgLz59IC8+XG4gICAgICAgICAgPFJvdXRlIHBhdGg9XCIvbGVhdmUvbGVhdmVBcHByb3ZlXCIgZWxlbWVudD17PExlYXZlQXBwcm92ZSAvPn0gLz5cbiAgICAgICAgPC9Sb3V0ZT5cbiAgICAgIDwvUm91dGU+XG4gICAgICA8Um91dGUgcGF0aD1cIi9sb2dpblwiIGVsZW1lbnQ9ezxMb2dpbiAvPn0+PC9Sb3V0ZT5cbiAgICAgIDxSb3V0ZSBwYXRoPVwiL2ZvcmdvdFBhc3N3b3JkXCIgZWxlbWVudD17PEZvcmdvdFBhc3N3b3JkIC8+fT48L1JvdXRlPlxuICAgIDwvPlxuICApXG4pO1xuXG5jcmVhdGVSb290KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290JykpLnJlbmRlcihcbiAgPFByb3ZpZGVyIHN0b3JlPXtzdG9yZX0+XG4gICAgPFJvdXRlclByb3ZpZGVyIHJvdXRlcj17cm91dGVyfSAvPlxuICA8L1Byb3ZpZGVyPlxuKTtcbiJdLCJmaWxlIjoiQzovVXNlcnMvSGFyc2ggUGF0ZWwvUHJvZ3JhbW1pbmcvUHJvamVjdC9FbXBsb3llZS1NYW5hZ2VtZW50LVN5c3RlbS9Gcm9udGVuZC9zcmMvbWFpbi5qc3gifQ==