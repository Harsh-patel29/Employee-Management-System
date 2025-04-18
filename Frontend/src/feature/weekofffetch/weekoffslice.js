import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const createWeekOff = createAsyncThunk(
  'weekOff/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v8/weekoff/createWeekOff',
        data,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllWeekOff = createAsyncThunk(
  'weekoff/getWeekOff',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        'http://localhost:8000/api/v8/weekoff/getAllWeekOff',
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteWeekOff = createAsyncThunk(
  'weekoff/deleteWeekOff',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        'http://localhost:8000/api/v8/weekoff/deleteWeekOff',
        { data: id, withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getWeekOffById = createAsyncThunk(
  'weekodd/getWeekOffById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v8/weekoff/getweekOffById`,
        { id },
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateWeekOff = createAsyncThunk(
  'weekoff/updateWeekOff',
  async ({ data, id }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:8000/api/v8/weekoff/updateWeekOff`,
        { data, id },
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const weekOffSlice = createSlice({
  name: 'weekoff',
  initialState: {
    allWeekOff: [],
    createdWeekOff: null,
    deletedWeekOff: null,
    weekOffbyId: null,
    updatedWeekOff: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetWeekOff: (state) => {
      state.allWeekOff = [];
      state.createdWeekOff = null;
      state.deletedWeekOff = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createWeekOff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWeekOff.fulfilled, (state, action) => {
        state.loading = false;
        state.createdWeekOff = action.payload;
      })
      .addCase(createWeekOff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllWeekOff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllWeekOff.fulfilled, (state, action) => {
        state.loading = false;
        state.allWeekOff = action.payload;
      })
      .addCase(getAllWeekOff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteWeekOff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWeekOff.fulfilled, (state, action) => {
        state.loading = false;
        state.deletedWeekOff = action.payload;
      })
      .addCase(deleteWeekOff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getWeekOffById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWeekOffById.fulfilled, (state, action) => {
        state.loading = false;
        state.weekOffbyId = action.payload;
      })
      .addCase(getWeekOffById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateWeekOff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWeekOff.fulfilled, (state, action) => {
        state.loading = false;
        state.updatedWeekOff = action.payload;
      })
      .addCase(updateWeekOff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetWeekOff } = weekOffSlice.actions;
export default weekOffSlice.reducer;
