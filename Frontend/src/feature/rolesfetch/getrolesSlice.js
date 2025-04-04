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
      return rejectWithValue(error.response?.data?.message || error.message);
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
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createRole = createAsyncThunk(
  "auth/createRole",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/create/role",
        data,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateRole = createAsyncThunk(
  "auth/updateRole",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(
        `http://localhost:8000/api/v1/user/update/keyroles/${id}`,
        data,
        { withCredentials: true }
      );
      return res.data;
    }catch(error){
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteRole = createAsyncThunk(
  "auth/deleteRole",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/user/delete/role/${id}`,
        { withCredentials: true }
      );
      console.log(res.data);  
      return res.data;
    }catch(error){
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getRoleById = createAsyncThunk(
  "auth/getRoleById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/user/get/role/${id}`, 
        { withCredentials: true }
      );
      return res.data;
    }catch(error){
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const roleSlice = createSlice({
  name: "getrole",
  initialState: {
    roles: null,
    keys: null,
    createdRole: null,
    updatedRole: null,
    deletedRole: null,
    roleById: null,
    error: null,
    loading: false,
  },
  reducers: {
    resetCreatedRole: (state) => {
      state.createdRole = null;
    },
    resetUpdatedRole: (state) => {
      state.updatedRole = null;
    },
    resetDeletedRole: (state) => {
      state.deletedRole = null;
    }
  },
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
      })
      .addCase(createRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.createdRole = action.payload;
        state.loading = false;
      })
      .addCase(createRole.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      }).addCase(updateRole.fulfilled, (state, action) => {
        state.updatedRole = action.payload;
        state.loading = false;
      }).addCase(updateRole.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(getRoleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoleById.fulfilled, (state, action) => {
        state.roleById = action.payload;
        state.loading = false;
      })  
      .addCase(getRoleById.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        })  
      .addCase(deleteRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.deletedRole = action.payload;
        state.loading = false;
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { resetCreatedRole, resetUpdatedRole, resetDeletedRole } = roleSlice.actions;
export default roleSlice.reducer;
