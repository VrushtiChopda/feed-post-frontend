import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie'

const BASE_URL = process.env.REACT_APP_BASE_URL
const initialState = {
    comment: [],
    loading: false,
    error: false
}

//------------- add comment -----------------------
export const addComment = createAsyncThunk('/addcomment', async ({ postId, comment }) => {
    const token = Cookies.get('token')
    console.log(token, "----- token while add comment -------")
    try {
        const res = await axios.post(`${BASE_URL}/comment/addComment`, { postId, comment },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        console.log(res, "res in addComment")
        return res.data
    } catch (error) {
        throw error
    }
})

//------------- get comment -----------------------
export const getComment = createAsyncThunk('/getcomment', async (postId) => {
    const token = Cookies.get('token')
    try {
        const res = await axios.get(`${BASE_URL}/comment/getCommentById/${postId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return res
    } catch (error) {
        throw error
    }
})

//------------- edit comment -----------------------
export const editComment = createAsyncThunk('/updatecomment', async ({ commentId, comment }) => {
    const token = Cookies.get('token')
    try {
        const res = await axios.put(`${BASE_URL}/comment/updateComment/${commentId}`, { comment },
            {
                headers: { Authorization: `Bearer ${token}` }
            })
        console.log(res, "response in edit Comment")
        return res.data
    } catch (error) {
        throw error
    }
})

//------------- delete comment -----------------------
export const deleteComment = createAsyncThunk('/deleteComment', async (commentId) => {
    const token = Cookies.get('token')
    try {
        const res = await axios.delete(`${BASE_URL}/comment/deleteComment/${commentId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })

        console.log(res, 'deleteComment')
        return res.data
    } catch (error) {
        throw error
    }
})

//------------- delete comment by auth user -----------------------
export const deleteCommentByAuthorizedUser = createAsyncThunk('/deleteCommentByUSer', async (commentId) => {
    const token = Cookies.get('token')
    try {
        const res = await axios.delete(`${BASE_URL}/comment/deleteCommentByUser/${commentId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })

        console.log(res, 'deleteComment')
        return res.data
    } catch (error) {
        throw error
    }
})

const commentSlice = createSlice({
    name: 'comment',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addComment.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(addComment.fulfilled, (state, action) => {
                state.loading = false
                state.comment = action.payload
            })
            .addCase(addComment.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(getComment.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(getComment.fulfilled, (state, action) => {
                state.loading = false
                state.comment = action.payload
            })
            .addCase(getComment.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(editComment.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(editComment.fulfilled, (state, action) => {
                state.loading = false
                state.comment = action.payload
            })
            .addCase(editComment.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(deleteComment.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.loading = false
                state.comment = action.payload
            })
            .addCase(deleteComment.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(deleteCommentByAuthorizedUser.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(deleteCommentByAuthorizedUser.fulfilled, (state, action) => {
                state.loading = false
                state.comment = action.payload
            })
            .addCase(deleteCommentByAuthorizedUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
    }
})

export default commentSlice.reducer 