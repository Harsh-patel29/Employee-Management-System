import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getRoles = createAsyncThunk(
  "auth/getRoles",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/user/roles/all",
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getKeys = createAsyncThunk(
  "auth/getkeys",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/user/get/keyroles",
        { withCredentials: true }
      );
      console.log(res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const roleSlice = createSlice({
  name: "getrole",
  initialState: {
    roles: null,
    keys: null,
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoles.fulfilled, (state, action) => {
        state.roles = action.payload;
        state.loading = false;
      })
      .addCase(getRoles.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(getKeys.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getKeys.fulfilled, (state, action) => {
        state.keys = action.payload;
        state.loading = false;
      })
      .addCase(getKeys.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default roleSlice.reducer;
