import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getdetail = createAsyncThunk(
  "getdetail/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/user/detail/role",
        {
          withCredentials: true,
        }
      );
      return res.data.message;
    } catch (error) {
      rejectWithValue(
        error?.response?.data?.message || "Failed to fetch details"
      );
    }
  }
);

const detailSlice = createSlice({
  name: "getDetail",
  initialState: {
    detail: null,
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getdetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(getdetail.fulfilled, (state, action) => {
        state.detail = action.payload;
        state.loading = false;
      })
      .addCase(getdetail.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default detailSlice.reducer;
