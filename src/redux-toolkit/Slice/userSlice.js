import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie';

const BASE_URL = process.env.REACT_APP_BASE_URL

const initialState = {
    user: [],
    loading: false,
    error: false,
}

//---------------- register user ------------------
export const userRegister = createAsyncThunk('/register', async (userData) => {
    try {
        const registerData = await axios.post(`${BASE_URL}/user/register`, userData)
        console.log(registerData.data, "----------- register data ----------------")
        return registerData.data
    } catch (error) {
        throw error
    }
})

//---------------- login user ---------------------
export const userLogin = createAsyncThunk('/login', async (userData) => {
    console.log(userData, "------- userData -------- ")
    try {
        const data = await axios.post(`${BASE_URL}/user/login`, userData)
        console.log(data.data, "data after api response")
        const token = data.data.data
        if (token) {
            Cookies.set('token', token)
        } else {
            console.log("token not available")
        }
        return data.data
    } catch (error) {
        throw error
    }
})

//------------- user profile------------------------
export const userProfile = createAsyncThunk('/profile', async () => {
    const token = Cookies.get('token')
    try {
        const data = await axios.get(`${BASE_URL}/user/getuser`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        // console.log(data, "data in userProfile")
        return data
    }
    catch (error) {
        throw error
    }
})

//-------------- update user -----------------------

export const updateUserProfile = createAsyncThunk('/updateProfile', async ({ userId, userData }) => {
    const token = Cookies.get('token')
    try {
        const data = await axios.put(`${BASE_URL}/user/updateuser/${userId}`, userData,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        console.log(data, "--------updateUserProfile--------")
        return data
    } catch (error) {
        throw error
    }
})

const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(userRegister.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(userRegister.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload.data
            })
            .addCase(userRegister.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(userLogin.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(userLogin.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload.data
            })
            .addCase(userLogin.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(userProfile.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(userProfile.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload.data
            })
            .addCase(userProfile.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload.data
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
    }
})

export default userSlice.reducer