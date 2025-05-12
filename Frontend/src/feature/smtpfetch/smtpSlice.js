import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const createSMTP = createAsyncThunk(
  'auth/createSMTP',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v9/smtp/createSMTP',
        data,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const getSMTP = createAsyncThunk(
  'auth/getSMTP',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('http://localhost:8000/api/v9/smtp/getSMTP', {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const updateSMTP = createAsyncThunk(
  'auth/updateSMTP',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        'http://localhost:8000/api/v9/smtp/updateSMTP',
        data,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

const smtpSlice = createSlice({
  name: 'smtpSlice',
  initialState: {
    smtp: null,
    loading: false,
    error: null,
    fetchedsmtp: null,
    updatedsmtp: null,
  },
  reducers: {
    resetCreateSMTP: (state) => {
      state.smtp = null;
    },
    resetUpdateSMTP: (state) => {
      state.updatedsmtp = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSMTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSMTP.fulfilled, (state, action) => {
        state.loading = false;
        state.smtp = action.payload;
      })
      .addCase(createSMTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSMTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSMTP.fulfilled, (state, action) => {
        state.loading = false;
        state.fetchedsmtp = action.payload;
      })
      .addCase(getSMTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSMTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSMTP.fulfilled, (state, action) => {
        state.updatedsmtp = action.payload;
        state.loading = false;
      })
      .addCase(updateSMTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { resetCreateSMTP, resetUpdateSMTP } = smtpSlice.actions;
export default smtpSlice.reducer;
