import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../feature/ToggleMode/ToggleModeSlice";
import ToggleSideBarSliceReducer from "../feature/ToggelSideBar/ToggleSideBarSlice";
import authSliceReducer from "../feature/datafetch/datafetchSlice.js";
import userSliceReducer from "../feature/datafetch/userfetchSlice.js";
import detailSliceReducer from "../feature/datafetch/detailfetchSlice.js";
import ChangeDetailSliceReducer from "../feature/datafetch/ChangeFetch.js";
import markattendanceSliceReducer from "../feature/attendancefetch/attendanceSlice.js";
export default configureStore({
  reducer: {
    theme: themeReducer,
    Sidebar: ToggleSideBarSliceReducer,
    auth: authSliceReducer,
    getuser: userSliceReducer,
    getDetail: detailSliceReducer,
    ChangeAccess: ChangeDetailSliceReducer,
    markAttendance: markattendanceSliceReducer,
  },
});
