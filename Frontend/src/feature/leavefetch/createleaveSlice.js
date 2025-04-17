import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const createLeave = createAsyncThunk(
  'leave/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v5/leave/create-leave',
        data,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAllLeave = createAsyncThunk(
  'leave/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        'http://localhost:8000/api/v5/leave/get-all-leave',
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getLeaveById = createAsyncThunk(
  'leave/getById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v5/leave/get-leave-by-id',
        { id },
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateLeave = createAsyncThunk(
  'leave/update',
  async ({ data, id }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        'http://localhost:8000/api/v5/leave/update-leave',
        { data, id },
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteLeave = createAsyncThunk(
  'leave/delete',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        'http://localhost:8000/api/v5/leave/delete-leave',
        { data: id, withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createNewLeave = createAsyncThunk(
  'leave/createNew',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v5/leave/create-new-leave',
        data,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getCreatedLeave = createAsyncThunk(
  'leave/getCreatedLeave',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        'http://localhost:8000/api/v5/leave/get-created-leave',
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateCreatedLeave = createAsyncThunk(
  'leave/updateCreatedLeave',
  async ({ data, id }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        'http://localhost:8000/api/v5/leave/update-created-leave',
        { data, id },
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getCreatedLeaveById = createAsyncThunk(
  'leave/getCreatedLeaveById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v5/leave/get-created-leave-by-id',
        { id },
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteCreatedLeave = createAsyncThunk(
  'leave/deleteCreatedLeave',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        'http://localhost:8000/api/v5/leave/delete-created-leave',
        { data: id, withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const approveLeave = createAsyncThunk(
  'leave/approve',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v5/leave/approve-leave',
        { id },
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const rejectLeave = createAsyncThunk(
  'leave/reject',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v5/leave/reject-leave',
        { id },
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const createleaveSlice = createSlice({
  name: 'leave',
  initialState: {
    leave: null,
    allLeave: [],
    leaveById: null,
    newLeave: null,
    createdLeaves: null,
    updatedNewLeave: null,
    getNewLeaveById: null,
    deletedCreatedLeave: null,
    deletedLeave: null,
    updatedLeave: null,
    newLeave: null,
    approvedLeave: null,
    rejectedLeave: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetLeave: (state) => {
      state.leave = null;
      state.allLeave = [];
      state.updatedLeave = null;
      state.loading = false;
      state.updatedLeave = null;
      state.deletedLeave = null;
      state.leaveById = null;
    },
    resetError: (state) => {
      state.error = null;
    },
    resetNewLeave: (state) => {
      state.newLeave = null;
    },
    resetCreatedLeave: (state) => {
      state.createdLeaves = null;
    },
    resetUpdatedNewLeave: (state) => {
      state.updatedNewLeave = null;
    },
    resetDeletedCreatedLeave: (state) => {
      state.deletedCreatedLeave = null;
    },
    resetApprovedLeave: (state) => {
      state.approvedLeave = null;
    },
    resetRejectedLeave: (state) => {
      state.rejectedLeave = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createLeave.pending, (state) => {
      state.loading = true;
    });
    builder
      .addCase(createLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.leave = action.payload;
      })
      .addCase(createLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.allLeave = action.payload;
      })
      .addCase(getAllLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.deletedLeave = action.payload;
      })
      .addCase(deleteLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateLeave.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.updatedLeave = action.payload;
      })
      .addCase(updateLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getLeaveById.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(getLeaveById.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveById = action.payload;
      })
      .addCase(getLeaveById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createNewLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.newLeave = action.payload;
      })
      .addCase(createNewLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCreatedLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCreatedLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.createdLeaves = action.payload;
      })
      .addCase(getCreatedLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCreatedLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCreatedLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.updatedNewLeave = action.payload;
      })
      .addCase(updateCreatedLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCreatedLeaveById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCreatedLeaveById.fulfilled, (state, action) => {
        state.loading = false;
        state.getNewLeaveById = action.payload;
      })
      .addCase(getCreatedLeaveById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCreatedLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCreatedLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.deletedCreatedLeave = action.payload;
      })
      .addCase(deleteCreatedLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(approveLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.approvedLeave = action.payload;
      })
      .addCase(approveLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(rejectLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.rejectedLeave = action.payload;
      })
      .addCase(rejectLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  resetLeave,
  resetError,
  resetNewLeave,
  resetCreatedLeave,
  resetUpdatedNewLeave,
  resetDeletedCreatedLeave,
  resetApprovedLeave,
  resetRejectedLeave,
} = createleaveSlice.actions;
export default createleaveSlice.reducer;
