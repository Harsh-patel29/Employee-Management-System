import { createSlice } from '@reduxjs/toolkit';

const filterSlice = createSlice({
  name: 'filter',
  initialState: {
    filterValue: {},
  },
  reducers: {
    setFilter: (state, action) => {
      const { screen, values } = action.payload;
      state.filterValue[screen] = values;
    },
    clearFilter: (state, action) => {
      const { screen } = action.payload;
      if (screen && state.filterValue[screen]) {
        state.filterValue[screen] = {};
      }
    },
  },
});

export const { setFilter, clearFilter } = filterSlice.actions;
export default filterSlice.reducer;
