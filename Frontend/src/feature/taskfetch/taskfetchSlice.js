import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const createTask = createAsyncThunk(
  "auth/createTask",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v4/tasks/createtask",
        _,
        { withCredentials: true }
      );
      console.log(res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAllTasks = createAsyncThunk(
  "auth/getallTasks",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v4/tasks/gettask",
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  "auth/updateTaskStatus",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        "http://localhost:8000/api/v4/tasks/updatetaskstatus",
        data,
        { withCredentials: true }
      );
      console.log(res.data)
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
const taskSlice = createSlice({
  name: "task",
  initialState: {
    tasks: [],
    updateTaskStatus: null,
    createtask: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addCase(getAllTasks.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.createtask = action.payload;
        state.loading = false;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      }).addCase(updateTaskStatus.pending,(state)=>{
        state.loading = true
        state.error = null
      }).addCase(updateTaskStatus.fulfilled,(state,action)=>{
        state.updateTaskStatus = action.payload
        state.loading = false
      }).addCase(updateTaskStatus.rejected,(state,action)=>{
        state.error = action.payload
        state.loading = false
      });
  },
});

export default taskSlice.reducer;
