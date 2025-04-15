import {createAsyncThunk,createSlice} from "@reduxjs/toolkit"
import axios from "axios"

export const createLeave = createAsyncThunk("leave/create",async(data,{rejectWithValue})=>{
    try {
        const res =await axios.post("http://localhost:8000/api/v5/leave/create-leave",data,{withCredentials:true})
        return res.data
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const getAllLeave = createAsyncThunk("leave/getAll",async(_,{rejectWithValue})=>{
    try {
        const res = await axios.get("http://localhost:8000/api/v5/leave/get-all-leave",{withCredentials:true})
        return res.data
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const getLeaveById = createAsyncThunk("leave/getById",async(id,{rejectWithValue})=>{
    try {
        const res = await axios.post("http://localhost:8000/api/v5/leave/get-leave-by-id",{id},{withCredentials:true})        
        return res.data
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const updateLeave = createAsyncThunk("leave/update",async({data,id},{rejectWithValue})=>{
    try {
        const res = await axios.put("http://localhost:8000/api/v5/leave/update-leave",{data,id},{withCredentials:true})
        return res.data
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const deleteLeave = createAsyncThunk("leave/delete",async(id,{rejectWithValue})=>{
    try {
        const res =await axios.delete("http://localhost:8000/api/v5/leave/delete-leave",{data:id,withCredentials:true})
        return res.data
    } catch (error) {
        return rejectWithValue(error)
    }
})

const createleaveSlice = createSlice({
    name:"leave",
    initialState:{
        leave:null,
        allLeave:[],
        leaveById:null,
        deletedLeave:null,
        updatedLeave:null,
        loading:false,
        error:null
    },
    reducers:{
        resetLeave: (state) => {
            state.leave = null;
            state.allLeave = [];
            state.updatedLeave = null;
            state.loading = false;
            state.updatedLeave=null;
            state.deletedLeave = null;
            state.leaveById = null;
        },
        resetError: (state) => {
            state.error = null;
        },
    },
    extraReducers:(builder)=>{
        builder.addCase(createLeave.pending,(state)=>{
            state.loading = true
        })
        builder.addCase(createLeave.fulfilled,(state,action)=>{
            state.loading = false
            state.leave = action.payload
            
        }).addCase(createLeave.rejected,(state,action)=>{
            state.loading = false
            state.error = action.payload
        }).addCase(getAllLeave.pending,(state)=>{
            state.loading = true
            state.error = null
        }).addCase(getAllLeave.fulfilled,(state,action)=>{
            state.loading = false
            state.allLeave = action.payload
        }).addCase(getAllLeave.rejected,(state,action)=>{
            state.loading = false
            state.error = action.payload
        }).addCase(deleteLeave.pending,(state)=>{
            state.loading = true
            state.error = null 
        }).addCase(deleteLeave.fulfilled,(state,action)=>{
            state.loading = false
            state.deletedLeave = action.payload
        }).addCase(deleteLeave.rejected,(state,action)=>{
            state.loading = false
            state.error = action.payload
        }).addCase(updateLeave.pending,(state)=>{
            state.loading = false
            state.error = null
        }).addCase(updateLeave.fulfilled,(state,action)=>{
            state.loading = false
            state.updatedLeave = action.payload
        }).addCase(updateLeave.rejected,(state,action)=>{
            state.loading = false
            state.error = action.payload
        }).addCase(getLeaveById.pending,(state)=>{
            state.loading = false
            state.error = null
        }).addCase(getLeaveById.fulfilled,(state,action)=>{
            state.loading = false
            state.leaveById = action.payload
        }).addCase(getLeaveById.rejected,(state,action)=>{
            state.loading = false
            state.error = action.payload
        })
    }
})

export const {resetLeave,resetError} = createleaveSlice.actions
export default createleaveSlice.reducer