import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../feature/ToggleMode/ToggleModeSlice";
import ToggleSideBarSliceReducer from "../feature/ToggelSideBar/ToggleSideBarSlice";
export default configureStore({
  reducer: {
    theme: themeReducer,
    Sidebar: ToggleSideBarSliceReducer,
  },
});
