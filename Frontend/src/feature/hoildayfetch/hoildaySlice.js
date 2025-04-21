import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchHoliday = createAsyncThunk(
  'holiday/fetchHoliday',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        'http://localhost:8000/api/v7/holiday/get-holiday',
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createHoliday = createAsyncThunk(
  'holiday/createHoliday',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v7/holiday/create-holiday',
        data,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateHoliday = createAsyncThunk(
  'holiday/updateHoliday',
  async ({ data, id }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:8000/api/v7/holiday/update-holiday`,
        { data, id },
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteHoliday = createAsyncThunk(
  'holiday/deleteHoliday',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v7/holiday/delete-holiday`,
        { data: id, withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getHolidayById = createAsyncThunk(
  'holiday/getHolidayById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v7/holiday/get-holiday-by-id`,
        { id },
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const holidaySlice = createSlice({
  name: 'holiday',
  initialState: {
    allHoliday: [],
    createdholiday: null,
    updatedHoliday: null,
    deletedHoliday: null,
    holidayById: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetHoliday: (state) => {
      state.allHoliday = [];
      state.createdholiday = null;
      state.updatedHoliday = null;
      state.loading = false;
    },
    resetDeletedHoliday: (state) => {
      state.deletedHoliday = null;
      state.loading = false;
      state.error = null;
    },
    resetHolidayById: (state) => {
      state.holidayById = null;
      state.loading = false;
      state.error = null;
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHoliday.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHoliday.fulfilled, (state, action) => {
        state.loading = false;
        state.allHoliday = action.payload;
      })
      .addCase(fetchHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createHoliday.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHoliday.fulfilled, (state, action) => {
        state.loading = false;
        state.createdholiday = action.payload;
      })
      .addCase(createHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateHoliday.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHoliday.fulfilled, (state, action) => {
        state.loading = false;
        state.updatedHoliday = action.payload;
      })
      .addCase(updateHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteHoliday.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHoliday.fulfilled, (state, action) => {
        state.loading = false;
        state.deletedHoliday = action.payload;
      })
      .addCase(deleteHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getHolidayById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHolidayById.fulfilled, (state, action) => {
        state.loading = false;
        state.holidayById = action.payload;
      })
      .addCase(getHolidayById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  resetHoliday,
  resetDeletedHoliday,
  resetHolidayById,
  resetError,
} = holidaySlice.actions;
export default holidaySlice.reducer;
