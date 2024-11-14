import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie'

const BASE_URL = process.env.REACT_APP_BASE_URL

const initialState = {
    reply: [],
    error: false,
    loading: false
}

//---------------- add reply ------------------------
export const addReply = createAsyncThunk('/addReply', async ({ userId, postsId, commentId, replyText }, { rejectWithValue }) => {
    try {
        const payload = {
            parentId: commentId,
            userId: userId,
            postId: postsId,
            commentReply: replyText
        }
        // console.log(payload, " ----- add reply payload -----")
        const res = await axios.post(`${BASE_URL}/reply/createReply`, payload)
        // console.log(res.data.data, "response in slice")
        return res.data.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message)
    }
})

//---------------- get reply ------------------------
export const getReply = createAsyncThunk('/getReply', async (commentId, { rejectWithValue }) => {
    try {
        const token = Cookies.get('token')
        const res = await axios.get(`${BASE_URL}/reply/getReply/${commentId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        console.log(res, "--------- reply data ------")
        return res.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message)
    }

})

//---------------- update reply ------------------------
export const updateReply = createAsyncThunk('updateReply', async (data, { rejectWithValue }) => {
    try {
        // console.log(data.id, "replyId in slice")
        // console.log(data.text, "reply data in slice")
        const token = Cookies.get('token')
        const res = await axios.put(`${BASE_URL}/reply/updateReply/${data.id}`, {
            commentReply: data.text
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        // console.log(res, "response in update Slice")
        return res.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message)
    }
})

//---------------- delete reply ------------------------
export const deleteReply = createAsyncThunk('/deleteReply', async (replyId, {   rejectWithValue }) => {
    try {
        const token = Cookies.get('token')
        const res = await axios.delete(`${BASE_URL}/reply/deleteReply/${replyId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        // console.log(res, "res in delete Reply")
        return res.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message)
    }
})

export const deleteReplyByAuthorizedUser = createAsyncThunk('/deleteReplyByAuthUser', async (replyId, { rejectWithValue }) => {
    try {
        console.log(replyId, "----------- replyId ---------------")
        const token = Cookies.get('token')
        const res = await axios.delete(`${BASE_URL}/reply/deleteReplyByAuthUser/${replyId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log(res, "res in delete Reply by auth user")
        return res.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message)
    }
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
                state.reply = action.payload
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
            .addCase(deleteReply.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(deleteReply.fulfilled, (state, action) => {
                state.loading = false
                state.reply = action.payload.data
            })
            .addCase(deleteReply.rejected, (state, action) => {
                state.error = action.error.message
                state.loading = false
            })
            .addCase(deleteReplyByAuthorizedUser.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(deleteReplyByAuthorizedUser.fulfilled, (state, action) => {
                state.loading = false
                state.reply = action.payload.data
            })
            .addCase(deleteReplyByAuthorizedUser.rejected, (state, action) => {
                state.error = action.error.message
                state.loading = false
            })
    }
})

export default replySlice.reducer