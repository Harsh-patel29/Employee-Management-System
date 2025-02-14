import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../feature/ToggleMode/ToggleModeSlice";
import ToggleSideBarSliceReducer from "../feature/ToggelSideBar/ToggleSideBarSlice";
import authSliceReducer from "../feature/datafetch/datafetchSlice.js";
export default configureStore({
  reducer: {
    theme: themeReducer,
    Sidebar: ToggleSideBarSliceReducer,
    auth: authSliceReducer,
  },
});
