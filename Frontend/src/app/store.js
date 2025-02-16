import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../feature/ToggleMode/ToggleModeSlice";
import ToggleSideBarSliceReducer from "../feature/ToggelSideBar/ToggleSideBarSlice";
import authSliceReducer from "../feature/datafetch/datafetchSlice.js";
import userSliceReducer from "../feature/datafetch/userfetchSlice.js";
export default configureStore({
  reducer: {
    theme: themeReducer,
    Sidebar: ToggleSideBarSliceReducer,
    auth: authSliceReducer,
    getuser: userSliceReducer,
  },
});
