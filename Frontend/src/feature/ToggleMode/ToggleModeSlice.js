import { createSlice } from "@reduxjs/toolkit";

const toggelMode = createSlice({
  name: "theme",
  initialState: {
    theme: localStorage.getItem("theme") || "light",
  },
  reducers: {
    toggletheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.theme);
    },
  },
});

export const { toggletheme } = toggelMode.actions;

export default toggelMode.reducer;
