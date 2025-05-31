import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getemployeeSalary = createAsyncThunk(
  'auth/getemployeeSalary',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        'http://localhost:8000/api/v12/employeesalary/getEmpSalary',
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const updateEmployeeSalary = createAsyncThunk(
  'auth/updateEmployeeSalary',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v12/employeesalary/updateEmpSalary',
        data,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

const employeeSalary = createSlice({
  name: 'EmpSalary',
  initialState: {
    createEmployeeSalary: [],
    fetchedEmployeeSalary: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetcreatemployeeSalaryData: (state) => {
      state.loading = false;
      state.error = false;
      state.createEmployeeSalary = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getemployeeSalary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getemployeeSalary.fulfilled, (state, action) => {
        state.fetchedEmployeeSalary = action.payload;
        state.loading = false;
      })
      .addCase(getemployeeSalary.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(updateEmployeeSalary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployeeSalary.fulfilled, (state, action) => {
        state.createEmployeeSalary = action.payload;
        state.loading = false;
      })
      .addCase(updateEmployeeSalary.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { resetcreatemployeeSalaryData } = employeeSalary.actions;
export default employeeSalary.reducer;
