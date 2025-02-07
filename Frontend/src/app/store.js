import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../feature/ToggleMode/ToggleModeSlice";
export default configureStore({
  reducer: {
    theme: themeReducer,
  },
});
