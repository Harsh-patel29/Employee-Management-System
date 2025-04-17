import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createTaskTimer = createAsyncThunk(
  'tasktimer/createTaskTimer',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v6/tasktimer/create',
        data,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const updateTaskTimer = createAsyncThunk(
  'tasktimer/updateTaskTimer',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v6/tasktimer/update',
        data,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getTaskTimer = createAsyncThunk(
  'tasktimer/getTaskTimer',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v6/tasktimer/get',
        id,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getTaskByUser = createAsyncThunk(
  'tasktimer/getTaskByUser',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v6/tasktimer/gettaskbyuser',
        data,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAllTaskTimer = createAsyncThunk(
  'tasktimer/getAllTaskTimer',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        'http://localhost:8000/api/v6/tasktimer/getalltasktimer',
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteTaskTimer = createAsyncThunk(
  'tasktimer/deleteTaskTimer',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        'http://localhost:8000/api/v6/tasktimer/delete',
        { data: id, withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const taskTimerSlice = createSlice({
  name: 'tasktimer',
  initialState: {
    createdTaskTimer: null,
    updatedTaskTimer: null,
    fetchedTaskTimer: null,
    taskByUser: null,
    allTaskTimer: null,
    deletedTaskTimer: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetTaskTimer: (state) => {
      state.createdTaskTimer = null;
      state.updatedTaskTimer = null;
      state.fetchedTaskTimer = null;
      state.deletedTaskTimer = null;
      state.loading = false;
      state.error = null;
    },
    resetTaskByUser: (state) => {
      state.taskByUser = null;
      state.loading = false;
      state.error = null;
    },
    resetAllTaskTimer: (state) => {
      state.allTaskTimer = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTaskTimer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTaskTimer.fulfilled, (state, action) => {
        state.createdTaskTimer = action.payload;
        state.loading = false;
      })
      .addCase(createTaskTimer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTaskTimer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaskTimer.fulfilled, (state, action) => {
        state.updatedTaskTimer = action.payload;
        state.loading = false;
      })
      .addCase(updateTaskTimer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTaskTimer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTaskTimer.fulfilled, (state, action) => {
        state.fetchedTaskTimer = action.payload;
        state.loading = false;
      })
      .addCase(getTaskTimer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTaskByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTaskByUser.fulfilled, (state, action) => {
        state.taskByUser = action.payload;
        state.loading = false;
      })
      .addCase(getTaskByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllTaskTimer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTaskTimer.fulfilled, (state, action) => {
        state.allTaskTimer = action.payload;
        state.loading = false;
      })
      .addCase(getAllTaskTimer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTaskTimer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTaskTimer.fulfilled, (state, action) => {
        state.deletedTaskTimer = action.payload;
        state.loading = false;
      })
      .addCase(deleteTaskTimer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetTaskTimer, resetTaskByUser, resetAllTaskTimer } =
  taskTimerSlice.actions;
export default taskTimerSlice.reducer;
