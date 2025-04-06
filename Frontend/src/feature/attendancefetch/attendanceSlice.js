import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const markAttendance = createAsyncThunk(
  "auth/markAttendance",
  async (
    { attendance, latitude, longitude },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const formData = new FormData();
      formData.append("attendance", attendance);
      formData.append("Latitude", latitude);
      formData.append("Longitude", longitude);
      const res = await axios.post(
        "http://localhost:8000/api/v2/attendance/attendance",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "mutipart/form-data",
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
  "auth/getAttendance",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v2/attendance/attendanceDetail",
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getUserDetails = createAsyncThunk(
  "auth/getUserDetails",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v2/attendance/attendance",
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
const markattendanceSlice = createSlice({
  name: "markAttendance",
  initialState: {
    attendance: null,
    newattendance: [],
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(markAttendance.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.attendance = action.payload;
        state.loading = false;
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(getUserDetails.pending, (state) => {
        state.error = null;
        state.loading = false;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.attendance = action.payload;
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
      });
  },
});
export const { resetAttendance } = markattendanceSlice.actions;
export default markattendanceSlice.reducer;
