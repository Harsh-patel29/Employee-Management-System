import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const createproject = createAsyncThunk(
  "auth/createproject",
  async (formdata, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v3/project/project",
        formdata,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getProjects = createAsyncThunk(
  "auth/getprojects",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v3/project/project",
        { withCredentials: true }
      );
      console.log(res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const createProjectSlice = createSlice({
  name: "project",
  initialState: {
    project: null,
    projects: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createproject.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(createproject.fulfilled, (state, action) => {
        state.project = action.payload;
        state.loading = false;
      })
      .addCase(createproject.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(getProjects.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
        state.loading = false;
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default createProjectSlice.reducer;
