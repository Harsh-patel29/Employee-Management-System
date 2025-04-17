import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const assignuser = createAsyncThunk(
  'auth/assignuser',
  async ({ data, userid }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(
        `http://localhost:8000/api/v3/project/project/roles/update/${userid}`,
        data,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getname = createAsyncThunk(
  'auth/getassignname',
  async (userid, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v3/project/project/roles/details/name/${userid}`,
        { withCredentials: true }
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteassignuser = createAsyncThunk(
  'auth/deleteuser',
  async ({ id, userId, roleId }, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v3/project/project/roles/details/name/delete/role/${id}/${userId}/${roleId}`,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const assignuserSlice = createSlice({
  name: 'assignusers',
  initialState: {
    assigneduser: null,
    totalassignedusers: [],
    deleteuser: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetAssigneduser: (state) => {
      state.assigneduser = null;
    },
    resetTotalassignedusers: (state) => {
      state.totalassignedusers = [];
    },
    resetDeleteuser: (state) => {
      state.deleteuser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(assignuser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignuser.fulfilled, (state, action) => {
        state.assigneduser = action.payload;
        state.loading = false;
      })
      .addCase(assignuser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(getname.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getname.fulfilled, (state, action) => {
        state.totalassignedusers = action.payload;
        state.loading = false;
      })
      .addCase(getname.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(deleteassignuser.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(deleteassignuser.fulfilled, (state, action) => {
        state.deleteuser = action.payload;
        state.loading = false;
      })
      .addCase(deleteassignuser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { resetAssigneduser, resetTotalassignedusers, resetDeleteuser } =
  assignuserSlice.actions;
export default assignuserSlice.reducer;
