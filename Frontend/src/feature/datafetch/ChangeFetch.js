import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getChangeDetail = createAsyncThunk(
  "settings/getdetails",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/user/settings/fetch/${id}`,
        id,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      console.log(error);

      return rejectWithValue(error);
    }
  }
);

const ChangeDetailSlice = createSlice({
  name: "ChangeAccess",
  initialState: {
    detail: null,
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getChangeDetail.pending, (state) => {
        state.loading = null;
        state.error = null;
      })
      .addCase(getChangeDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload;
      })
      .addCase(getChangeDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export default ChangeDetailSlice.reducer;
