import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    reply: [],
    error: false,
    loading: false
}

export const addReply = createAsyncThunk('/addReply', async (reply) => {
    const paylaod = {
        commentReply: reply
    }
    console.log(reply, "reply in slice")
    const res = axios.post('http://localhost:3000/reply/createReply', paylaod)
    console.log(res.data, "response in slice")
    return res.data
})

export const getReply = createAsyncThunk('/getReply', async (commentId) => {
    const payload = {
        parentId: commentId
    }
    const res = axios.get('http://localhost:3000/reply/getReply', payload)
    console.log(res.data, "response in get reply")
    return res.data
})

const replySlice = createSlice({
    name: 'reply',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addReply.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(addReply.fulfilled, (state, action) => {
                state.reply = action.payload.data
                state.loading = false
            })
            .addCase(addReply.rejected, (state, action) => {
                state.error = action.error.message
                state.loading = false
            })
            .addCase(getReply.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(getReply.fulfilled, (state, action) => {
                state.loading = false
                state.reply = action.payload.data
            })
            .addCase(getReply.rejected, (state, action) => {
                state.error = action.error.message
                state.loading = false
            })
    }
})

export default replySlice.reducer