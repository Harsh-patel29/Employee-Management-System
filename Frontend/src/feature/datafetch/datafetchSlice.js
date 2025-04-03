import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        userData,
        { withCredentials: true }
      );
      dispatch(getLoginDetail());

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const getLoginDetail = createAsyncThunk(
  "auth/getDetails",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/login", {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/chechkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/login", {
        withCredentials: true,
      });

      return res.data;
    } catch (error) {
      return rejectWithValue("Not Authenticated");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.loading = false;
      })
      .addCase(getLoginDetail.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getLoginDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getLoginDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
