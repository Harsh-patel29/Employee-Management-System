import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const addSalary = createAsyncThunk(
  'auth/addSalary',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v11/salary/addsalary',
        data,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getSalary = createAsyncThunk(
  'auth/getSalary',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        'http://localhost:8000/api/v11/salary/getsalary',
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateSalary = createAsyncThunk(
  'auth/updateSalary',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        'http://localhost:8000/api/v11/salary/updatesalary',
        { id, data },
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const getSalarybyId = createAsyncThunk(
  'auth/getsalarybyId',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v11/salary/getsalarybyId',
        { id: id },
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const deletesalary = createAsyncThunk(
  'auth/deleteSalary',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v11/salary/deletesalary',
        { id: id },
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

const salarySlice = createSlice({
  name: 'salary',
  initialState: {
    addedSalary: [],
    fetchedSalary: [],
    updatedSalary: [],
    fetchedSalarybyId: [],
    deletedSalary: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetAddedSalary: (state) => {
      state.addedSalary = [];
      state.loading = false;
      state.error = null;
    },
    resetUpdatedSalary: (state) => {
      state.updatedSalary = [];
      state.loading = false;
      state.error = null;
    },
    resetDeletedSalary: (state) => {
      state.deletedSalary = [];
      state.loading = false;
      state.error = null;
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addSalary.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addSalary.fulfilled, (state, action) => {
        state.addedSalary = action.payload;
        state.loading = false;
      })
      .addCase(addSalary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSalary.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(getSalary.fulfilled, (state, action) => {
        state.fetchedSalary = action.payload;
        state.loading = false;
      })
      .addCase(getSalary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSalary.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateSalary.fulfilled, (state, action) => {
        state.updatedSalary = action.payload;
        state.loading = false;
      })
      .addCase(updateSalary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSalarybyId.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(getSalarybyId.fulfilled, (state, action) => {
        state.fetchedSalarybyId = action.payload;
        state.loading = false;
      })
      .addCase(getSalarybyId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletesalary.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deletesalary.fulfilled, (state, action) => {
        state.deletedSalary = action.payload;
        state.loading = false;
      })
      .addCase(deletesalary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  resetAddedSalary,
  resetUpdatedSalary,
  resetDeletedSalary,
  resetError,
} = salarySlice.actions;
export default salarySlice.reducer;
