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
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getProjectbyId = createAsyncThunk(
  "auth/getprojectbyid",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v3/project/project/${id}`,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateproject = createAsyncThunk(
  "auth/updateproject",
  async ({ data, id }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:8000/api/v3/project/projects/update/${id}`,
        data,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteProject = createAsyncThunk(
  "auth/deleteproject",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v3/project/projects/delete/${id}`,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const uploadLogo = createAsyncThunk(
  "auth/upload-logo",
  async (file, { rejectWithValue }) => {
    const formdata = new FormData();
    formdata.append("logo", file);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v3/project/upload-logo",
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
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
    projectbyid: null,
    deletedproject: null,
    updatedproject: null,
    logo: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createproject.pending, (state) => {
        state.loading = false;
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
        state.loading = false;
        state.error = false;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
        state.loading = false;
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(deleteProject.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.deletedproject = action.payload;
        state.loading = false;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(updateproject.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateproject.fulfilled, (state, action) => {
        state.updatedproject = action.payload;
        state.loading = false;
      })
      .addCase(updateproject.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(getProjectbyId.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(getProjectbyId.fulfilled, (state, action) => {
        state.projectbyid = action.payload;
        state.loading = false;
      })
      .addCase(getProjectbyId.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(uploadLogo.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(uploadLogo.fulfilled, (state, action) => {
        state.logo = action.payload;
        state.loading = false;
      })
      .addCase(uploadLogo.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default createProjectSlice.reducer;
