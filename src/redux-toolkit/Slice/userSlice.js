import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie';
const initialState = {
    user: [],
    loading: false,
    error: false,
}

export const userRegister = createAsyncThunk('/register', async (userData) => {
    try {
        const registerData = await axios.post('http://localhost:3000/user/register', userData)
        console.log(registerData.data, "----------- register data ----------------")
        return registerData.data
    } catch (error) {
        throw error
    }
})

export const userLogin = createAsyncThunk('/login', async (userData) => {
    try {
        const data = await axios.post('http://localhost:3000/user/login', userData)
        console.log(data.data)
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
    }
})

export default userSlice.reducer