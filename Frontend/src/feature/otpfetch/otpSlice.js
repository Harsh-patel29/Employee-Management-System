import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const generateOtp = createAsyncThunk(
  'generateOtp',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v10/otp/generateOtp',
        data
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'verifyOtp',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v10/otp/verifyOtp',
        data
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

export const resendOTP = createAsyncThunk(
  'resendOTP',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v10/otp/resendOtp',
        data
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'resetPassword',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v10/otp/resetPassword',
        data
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

const otpSlice = createSlice({
  name: 'sendotp',
  initialState: {
    Loading: false,
    error: null,
    otp: null,
    verfiedOtp: null,
    resendedOtp: null,
    resetedPassword: null,
  },
  reducers: {
    resetOtp: (state) => {
      state.otp = null;
    },
    resetVerifyOtp: (state) => {
      state.verfiedOtp = null;
    },
    resetPasswordField: (state) => {
      state.resetedPassword = null;
    },
    resetResendedOtp: (state) => {
      state.resendedOtp = null;
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateOtp.pending, (state) => {
        state.Loading = true;
        state.error = null;
      })
      .addCase(generateOtp.fulfilled, (state, action) => {
        state.otp = action.payload;
        state.Loading = false;
      })
      .addCase(generateOtp.rejected, (state, action) => {
        state.Loading = false;
        state.error = action.payload;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.Loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.verfiedOtp = action.payload;
        state.Loading = false;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.Loading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.Loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.resetedPassword = action.payload;
        state.Loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.Loading = false;
        state.error = action.payload;
      })
      .addCase(resendOTP.pending, (state) => {
        state.Loading = true;
        state.error = null;
      })
      .addCase(resendOTP.fulfilled, (state, action) => {
        state.resendedOtp = action.payload;
        state.Loading = false;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.Loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  resetOtp,
  resetVerifyOtp,
  resetPasswordField,
  resetError,
  resetResendedOtp,
} = otpSlice.actions;
export default otpSlice.reducer;
