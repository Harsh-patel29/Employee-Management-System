import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const markAttendance = createAsyncThunk(
  'auth/markAttendance',
  async (
    { attendance, latitude, longitude },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const formData = new FormData();
      formData.append('attendance', attendance);
      formData.append('Latitude', latitude);
      formData.append('Longitude', longitude);
      const res = await axios.post(
        'http://localhost:8000/api/v2/attendance/attendance',
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'mutipart/form-data',
          },
        }
      );
      dispatch(getUserDetails());
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchAttendance = createAsyncThunk(
  'auth/getAttendance',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        'http://localhost:8000/api/v2/attendance/attendanceDetail',
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getUserDetails = createAsyncThunk(
  'auth/getUserDetails',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        'http://localhost:8000/api/v2/attendance/attendance',
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const AddRegularization = createAsyncThunk(
  'auth/createRegularization',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v2/attendance/regularization',
        data,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const GetRegularization = createAsyncThunk(
  'auth/getRegularization',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        'http://localhost:8000/api/v2/attendance/getRegularization',
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const ApprovedRegularization = createAsyncThunk(
  'auth/ApprovedRegularization',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v2/attendance/getApprovedRegularization',
        { id },
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const RejectRegularization = createAsyncThunk(
  'auth/RejectRegularization',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v2/attendance/RejectRegularization',
        { id },
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const getRegularizationbyDateandUser = createAsyncThunk(
  'auth/getRegularizationbyDetail',
  async ({ Date, user }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v2/attendance/getRegularizaitonDetail',
        { Date: Date, user: user },
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const getMonthlyReportDetail = createAsyncThunk(
  'auth/getMonthlyReport',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v2/attendance/getMonthlyReportDetails',
        data,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

const markattendanceSlice = createSlice({
  name: 'markAttendance',
  initialState: {
    isSheetOpen: false,
    isSubmitting: false,
    lastOperation: null,
    attendance: null,
    userDetails: null,
    newattendance: [],
    createdRegularization: null,
    fetchedRegularization: [],
    approvedRegularization: [],
    rejectedRegularization: [],
    fetchedRegularizationByDetail: [],
    fetchedMonthlyReportDetail: [],
    message: '',
    error: null,
    loading: false,
  },
  reducers: {
    resetAttendance: (state) => {
      state.attendance = null;
      state.newattendance = [];
      state.error = null;
      state.loading = false;
    },
    openAttendanceSheet: (state) => {
      state.isSheetOpen = true;
    },
    closeAttendanceSheet: (state) => {
      state.isSheetOpen = false;
    },
    setLastOperation: (state, action) => {
      state.lastOperation = action.payload;
    },
    resetRegularization: (state) => {
      state.createdRegularization = null;
      state.approvedRegularization = null;
      state.rejectedRegularization = null;
    },
    resetRegularizationByDetail: (state) => {
      state.fetchedRegularizationByDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(markAttendance.pending, (state) => {
        const now = Date.now();
        if (state.lastOperation && now - state.lastOperation < 1000) {
          return;
        }
        state.isSubmitting = true;
        state.lastOperation = now;
        state.error = null;
        state.loading = true;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.isSheetOpen = false;
        state.attendance = action.payload;
        state.loading = false;
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(getUserDetails.pending, (state) => {
        state.error = null;
        state.loading = false;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.userDetails = action.payload;
        state.loading = false;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchAttendance.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.newattendance = action.payload;
        state.loading = false;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(AddRegularization.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(AddRegularization.fulfilled, (state, action) => {
        state.createdRegularization = action.payload;
        state.loading = false;
      })
      .addCase(AddRegularization.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(GetRegularization.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(GetRegularization.fulfilled, (state, action) => {
        state.fetchedRegularization = action.payload;
        state.loading = false;
      })
      .addCase(GetRegularization.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(ApprovedRegularization.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(ApprovedRegularization.fulfilled, (state, action) => {
        state.approvedRegularization = action.payload;
        state.loading = false;
      })
      .addCase(ApprovedRegularization.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(RejectRegularization.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(RejectRegularization.fulfilled, (state, action) => {
        state.rejectedRegularization = action.payload;
        state.loading = false;
      })
      .addCase(RejectRegularization.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(getRegularizationbyDateandUser.pending, (state) => {
        state.error = null;
        state.loading = false;
      })
      .addCase(getRegularizationbyDateandUser.fulfilled, (state, action) => {
        state.fetchedRegularizationByDetail = action.payload;
        state.loading = false;
      })
      .addCase(getRegularizationbyDateandUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(getMonthlyReportDetail.pending, (state) => {
        state.error = null;
        state.loading = false;
      })
      .addCase(getMonthlyReportDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.fetchedMonthlyReportDetail = action.payload;
      })
      .addCase(getMonthlyReportDetail.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});
export const {
  resetAttendance,
  openAttendanceSheet,
  closeAttendanceSheet,
  setLastOperation,
  resetRegularization,
  resetRegularizationByDetail,
} = markattendanceSlice.actions;
export default markattendanceSlice.reducer;
