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

export const getDefaultValue = createAsyncThunk(
  "getdefaultvalue",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/user/role/defaultvalue",
        { withCredentials: true }
      );
      console.log(res.data);
      return res.data;
    } catch (error) {
      rejectWithValue(
        error?.response?.data?.message || "Failed to fetch details"
      );
    }
  }
);

const userSlice = createSlice({
  name: "getuser",
  initialState: {
    users: null,
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.users = null;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.users = null;
        state.error = action.payload;
      })
      .addCase(getDefaultValue.pending, (state) => {
        state.users = null;
        state.error = null;
        state.loading = true;
      })
      .addCase(getDefaultValue.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(getDefaultValue.rejected, (state, action) => {
        state.error = null;
        state.loading = false;
      });
  },
});

export default userSlice.reducer;
