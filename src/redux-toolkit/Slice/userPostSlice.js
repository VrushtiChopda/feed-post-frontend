import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie'

const initialState = {
    userpost: [],
    error: false,
    loading: false
}

export const getPostByUserId = createAsyncThunk('/getuserpost', async () => {
    const token = Cookies.get('token')
    try {
        const response = axios.get('http://localhost:3000/post/getPostById',
            {
                headers: { Authorization: `Bearer ${token}` }
            })
        return response
    } catch (error) {
        throw error
    }
})

// export const updatePost = createAsyncThunk('/updatePost', async (postId, postData) => {
//     const token = Cookies.get('token')
//     try {
//         const response = axios.put(`http://localhost:3000/post/updatePost/${postId}`, postData,
//             {
//                 headers: { Authorization: `Bearer ${token}` }
//             })
//         console.log(response)
//         return response
//     } catch (error) {
//         throw error
//     }
// })

const userPostSlice = createSlice({
    name: 'userpost',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPostByUserId.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(getPostByUserId.fulfilled, (state, action) => {
                state.loading = false
                state.userpost = action.payload.data
            })
            .addCase(getPostByUserId.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
        // .addCase(updatePost.pending, (state) => {
        //     state.loading = true
        //     state.error = false
        // })
        // .addCase(updatePost.fulfilled, (state, action) => {
        //     state.loading = false
        //     state.userpost = action.payload.data
        // })
        // .addCase(updatePost.rejected, (state, action) => {
        //     state.loading = false
        //     state.error = action.error.message
        // })
    }

})

export default userPostSlice.reducer