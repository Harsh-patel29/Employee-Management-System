import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const createuser = createAsyncThunk(
  "auth/createuser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/createUser",
        data,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

export const fetchuser = createAsyncThunk(
  "auth/fetchuser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/", {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data||error.message);
    }
  }
);

export const updateuser = createAsyncThunk(
  "auth/upadateuser",
  async ({ data, userid }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:8000/api/v1/user/${userid}`,
        data,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data||error.message);
    }
  }
);

export const deleteuser = createAsyncThunk(
  "auth/deleteuser",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/user/${id}`,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const createuserSlice = createSlice({
  name: "createuser",
  initialState: {
    createduser: null,
    fetchusers: [],
    deleteduser: null,
    updateduser: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetCreatedUser:(state)=>{
      state.createduser=null
    },
    resetUpdatedUser:(state)=>{
      state.updateduser=null
    },
    resetDeletedUser:(state)=>{
      state.deleteduser=null
    },
    reseterror:(state)=>{
      state.error=null
    },
    resetLoading:(state)=>{
      state.loading=null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createuser.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createuser.fulfilled, (state, action) => {
        state.createduser = action.payload;
        state.loading = false;
      })
      .addCase(createuser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchuser.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchuser.fulfilled, (state, action) => {
        state.fetchusers = action.payload;
        state.loading = false;
      })
      .addCase(fetchuser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(deleteuser.pending, (state) => {
        state.loading = false;
        state.error = false;
      })
      .addCase(deleteuser.fulfilled, (state, action) => {
        state.deleteduser = action.payload;
        state.loading = false;
      })
      .addCase(deleteuser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(updateuser.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateuser.fulfilled, (state, action) => {
        state.updateduser = action.payload;
        state.loading = false;
      })
      .addCase(updateuser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { resetCreatedUser, resetUpdatedUser, resetDeletedUser, reseterror, resetLoading } = createuserSlice.actions;
export default createuserSlice.reducer;
