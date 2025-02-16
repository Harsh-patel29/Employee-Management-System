import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
export const getUser = createAsyncThunk(
  "getuser/fetch",

  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/user/${id}`, {
        withCredentials: true,
      });

      return res.data;
    } catch (error) {
      rejectWithValue(
        error?.response?.data?.message || "Failed to fetch user details"
      );
    }
  }
);

const userSlice = createSlice({
  name: "getuser",
  initialState: {
    user: null,
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.user = null;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
