import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie'
const token = Cookies.get('token')

const initialState = {
    comment: [],
    loading: false,
    error: false
}

export const addComment = createAsyncThunk('/addcomment', async ({ postId, comment }) => {
    try {
        const res = await axios.post('http://localhost:3000/comment/addComment', { postId, comment },
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

export const getComment = createAsyncThunk('/getcomment', async (postId) => {
    try {
        const res = await axios.get(`http://localhost:3000/comment/getCommentById/${postId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return res
    } catch (error) {
        throw error
    }
})

export const editComment = createAsyncThunk('/updatecomment', async ({ commentId, comment }) => {
    const token = Cookies.get('token')
    try {
        const res = await axios.put(`http://localhost:3000/comment/updateComment/${commentId}`, { comment },
            {
                headers: { Authorization: `Bearer ${token}` }
            })
        console.log(res, "response in edit Comment")
        return res.data
    } catch (error) {
        throw error
    }
})

export const deleteComment = createAsyncThunk('/deleteComment', async (commentId) => {
    const token = Cookies.get('token')
    try {
        const res = await axios.delete(`http://localhost:3000/comment/deleteComment/${commentId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })

        console.log(res, 'deleteComment')
        return res.data
    } catch (error) {
        throw error
    }
})

export const deleteCommentByAuthorizedUser = createAsyncThunk('/deleteCommentByUSer', async (commentId) => {
    const token = Cookies.get('token')
    try {
        const res = await axios.delete(`http://localhost:3000/comment/deleteCommentByUser/${commentId}`, {
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