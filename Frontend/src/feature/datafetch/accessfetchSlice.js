import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAccessDetail = createAsyncThunk(
  "settings/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/user/settings/fetch",
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Fetching failed"
      );
    }
  }
);
const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    data: null,
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccessDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccessDetail.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchAccessDetail.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default settingsSlice.reducer;
