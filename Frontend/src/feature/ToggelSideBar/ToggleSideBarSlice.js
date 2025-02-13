import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isExpanded: false,
};

const ToggleSideBarSlice = createSlice({
  name: "Sidebar",
  initialState,
  reducers: {
    expandSideBar: (state) => {
      state.isExpanded = true;
    },
    collapedSideBar: (state) => {
      state.isExpanded = false;
    },
  },
});

export const { expandSideBar, collapedSideBar } = ToggleSideBarSlice.actions;

export default ToggleSideBarSlice.reducer;
