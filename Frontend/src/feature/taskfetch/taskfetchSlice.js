import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const createTask = createAsyncThunk(
  'auth/createTask',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v4/tasks/createtask',
        _,
        { withCredentials: true }
      );
      console.log(res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || error
      );
    }
  }
);

export const getAllTasks = createAsyncThunk(
  'auth/getallTasks',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        'http://localhost:8000/api/v4/tasks/gettask',
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || error
      );
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'auth/updateTaskStatus',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        'http://localhost:8000/api/v4/tasks/updatetaskstatus',
        data,
        { withCredentials: true }
      );
      console.log(res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || error
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  'auth/updateTask',
  async ({ data, id }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:8000/api/v4/tasks/updatetask/${id}`,
        data,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || error
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  'auth/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v4/tasks/deletetask/${id}`,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || error
      );
    }
  }
);

export const getTaskById = createAsyncThunk(
  'auth/getTaskById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v4/tasks/gettaskbyid/${id}`,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || error
      );
    }
  }
);

export const uploadAttachment = createAsyncThunk(
  'auth/upload-Attachments',
  async (files, { rejectWithValue }) => {
    const formdata = new FormData();

    if (files.length && typeof files !== 'string') {
      for (let i = 0; i < files.length; i++) {
        formdata.append('attachments', files[i]);
      }
    } else {
      formdata.append('attachments', files);
    }

    try {
      const res = await axios.post(
        'http://localhost:8000/api/v4/tasks/upload-attachments',
        formdata,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const Attachment = createAsyncThunk(
  'auth/upload-Attachemnt',
  async (files, { rejectWithValue }) => {
    const formdata = new FormData();
    if (files.length && typeof files !== 'string') {
      for (let i = 0; i < files.length; i++) {
        formdata.append('attachment', files[i]);
      }
    } else {
      formdata.append('attachment', files);
    }
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v4/tasks/upload-attachment',
        formdata,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteAttachment = createAsyncThunk(
  'auth/deleteAttachment',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v4/tasks/delete-attachment`,
        { data: { public_id: data }, withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || error
      );
    }
  }
);

export const deleteUploadedImage = createAsyncThunk(
  'auth/deleteUploadedImage',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v4/tasks/delete-uploaded-image`,
        { data: { public_id: data }, withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || error
      );
    }
  }
);

export const deleteAttachedFile = createAsyncThunk(
  'auth/deleteAttachedFile',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v4/tasks/delete-attachedFile`,
        { data: { public_id: data }, withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || error
      );
    }
  }
);

export const deleteTodo = createAsyncThunk(
  'auth/deleteTodo',
  async ({ data, id }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v4/tasks/remove-todo/${id}`,
        { todoId: data },
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || error
      );
    }
  }
);

const taskSlice = createSlice({
  name: 'task',
  initialState: {
    tasks: [],
    updateTaskStatus: null,
    updatedTask: null,
    deletedTask: null,
    deletedTodo: null,
    createtask: null,
    getTaskid: null,
    uploadedAttachment: null,
    uploadedAttachmentLoading: false,
    uploadedImage: null,
    uploadedImageLoading: false,
    deletedAttachment: null,
    deletedUploadedImage: null,
    deletedAttachedFile: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetTask: (state) => {
      state.updateTaskStatus = null;
      state.updatedTask = null;
      state.deletedTask = null;
      state.createtask = null;
      state.uploadedAttachment = null;
      state.deletedUploadedImage = null;
    },
    resetUploadedImage: (state) => {
      state.uploadedImage = null;
    },
    resetdeleteImage: (state) => {
      state.deletedUploadedImage = null;
    },
    resetdeletedAttachedFile: (state) => {
      state.deletedAttachedFile = null;
    },
  },
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
      })
      .addCase(updateTaskStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.updateTaskStatus = action.payload;
        state.loading = false;
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.updatedTask = action.payload;
        state.loading = false;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.deletedTask = action.payload;
        state.loading = false;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(getTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTaskById.fulfilled, (state, action) => {
        state.getTaskid = action.payload;
        state.loading = false;
      })
      .addCase(getTaskById.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(uploadAttachment.pending, (state) => {
        state.uploadedAttachmentLoading = true;
        state.error = null;
      })
      .addCase(uploadAttachment.fulfilled, (state, action) => {
        state.uploadedAttachment = action.payload;
        state.uploadedAttachmentLoading = false;
      })
      .addCase(uploadAttachment.rejected, (state, action) => {
        state.error = action.payload;
        state.uploadedAttachmentLoading = false;
      })
      .addCase(Attachment.pending, (state) => {
        state.uploadedImageLoading = true;
        state.error = null;
      })
      .addCase(Attachment.fulfilled, (state, action) => {
        state.uploadedImage = action.payload;
        state.uploadedImageLoading = false;
      })
      .addCase(Attachment.rejected, (state, action) => {
        state.error = action.payload;
        state.uploadedImageLoading = false;
      })
      .addCase(deleteAttachment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAttachment.fulfilled, (state, action) => {
        state.deletedAttachment = action.payload;
        state.loading = false;
      })
      .addCase(deleteAttachment.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(deleteUploadedImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUploadedImage.fulfilled, (state, action) => {
        state.deletedUploadedImage = action.payload;
        state.loading = false;
      })
      .addCase(deleteUploadedImage.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(deleteTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.deletedTodo = action.payload;
        state.loading = false;
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(deleteAttachedFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAttachedFile.fulfilled, (state, action) => {
        state.deletedAttachedFile = action.payload;
        state.loading = false;
      })
      .addCase(deleteAttachedFile.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const {
  resetTask,
  resetUploadedImage,
  resetdeleteImage,
  resetdeletedAttachedFile,
} = taskSlice.actions;
export default taskSlice.reducer;
