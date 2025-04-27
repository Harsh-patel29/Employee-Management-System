import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isExpanded: false,
  visible: false,
};

const ToggleSideBarSlice = createSlice({
  name: 'Sidebar',
  initialState,
  reducers: {
    expandSideBar: (state) => {
      state.isExpanded = true;
    },
    collapedSideBar: (state) => {
      state.isExpanded = false;
    },
    visible: (state) => {
      state.visible = true;
    },
    notVisible: (state) => {
      state.visible = false;
    },
  },
});

export const { expandSideBar, collapedSideBar, notVisible, visible } =
  ToggleSideBarSlice.actions;
export default ToggleSideBarSlice.reducer;
