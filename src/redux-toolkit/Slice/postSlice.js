import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie'

const BASE_URL = process.env.REACT_APP_BASE_URL

const initialState = {
    loading: false,
    error: false,
    post: []
}

//---------------- add post ------------------------
export const addPost = createAsyncThunk('/addPost', async ({ postData }, { rejectWithValue }) => {
    console.log(postData, "--------- postData in slice --------------")
    const token = Cookies.get('token')
    try {
        const data = await axios.post(`${BASE_URL}/post/addPost`, postData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        console.log(data, " -------- data -----------")
        return data.data
    } catch (error) {
        console.log(error)
        return rejectWithValue(error.response?.data?.message)
    }
})

//---------------- get post ------------------------
export const getPost = createAsyncThunk('/getPost', async () => {
    try {
        const data = await axios.get(`${BASE_URL}/post/getpost`)
        console.log(data, "---------- data ---------")
        return data.data
    } catch (error) {
        console.log(error)
        throw error
    }
})

//---------------- update post ------------------------
export const updatePost = createAsyncThunk('/updatePost', async ({ postId, postData }, { rejectWithValue }) => {
    const token = Cookies.get('token')
    // console.log(token, "token")
    try {
        const data = await axios.put(`${BASE_URL}/post/updatePost/${postId}`, postData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        // console.log(data, "data in update post")
        return data.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message)
    }
})

//---------------- delete post ------------------------
export const deletePost = createAsyncThunk('/deletePost', async (postId, { rejectWithValue }) => {
    const token = Cookies.get('token')
    try {
        const data = await axios.delete(`${BASE_URL}/post/deletePost/${postId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        return data.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "post not deleted")
    }
})

//---------------- archive post -------------------------
export const archivePost = createAsyncThunk('/archivePost', async ({ postId, archiveStatus }, { rejectWithValue }) => {
    console.log(archiveStatus, "status")
    const token = Cookies.get('token')
    console.log(token, "---------- token in archive post -------")
    try {
        const data = await axios.patch(`${BASE_URL}/post/archivePost/${postId}`, { isArchive: archiveStatus },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        )
        console.log(data, "------- data in archivePost slice -----------")
        return data.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message)
    }
})

//---------------- get archive post -----------------------
export const getArchivePost = createAsyncThunk('/getarchivepost', async () => {
    try {
        const data = await axios.get(`${BASE_URL}/post/getArchivePost`)
        console.log(data, "data in getArchivePost slice")
        return data.data
    } catch (error) {
        throw error
    }
})

const PostSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addPost.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(addPost.fulfilled, (state, action) => {
                state.loading = false
                state.post = action.payload.data
            })
            .addCase(addPost.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(getPost.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(getPost.fulfilled, (state, action) => {
                state.loading = false
                state.post = action.payload.data
            })
            .addCase(getPost.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(updatePost.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                state.loading = false
                state.post = action.payload.data
            })
            .addCase(updatePost.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(deletePost.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.loading = false
                state.post = action.payload.data
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(archivePost.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(archivePost.fulfilled, (state, action) => {
                state.loading = false
                state.post = action.payload.data
            })
            .addCase(archivePost.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(getArchivePost.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(getArchivePost.fulfilled, (state, action) => {
                state.loading = false
                state.post = action.payload.data
            })
            .addCase(getArchivePost.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
    }
})

export default PostSlice.reducer;