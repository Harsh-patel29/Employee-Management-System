import { createSlice } from '@reduxjs/toolkit';

const filterSlice = createSlice({
  name: 'filter',
  initialState: {
    filterValue: {},
  },
  reducers: {
    setFilter: (state, action) => {
      state.filterValue = action.payload;
    },
    clearFilter: (state) => {
      state.filterValue = {};
    },
  },
});

export const { setFilter, clearFilter } = filterSlice.actions;
export default filterSlice.reducer;
