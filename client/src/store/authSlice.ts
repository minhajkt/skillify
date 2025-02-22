
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export interface User {
    _id?: string
    id: string,
    name: string,
    email: string,
    profilePhoto: string
    role: string
}

interface AuthState {
    token : string | null,
    user: User | null;
    isAuthenticated: boolean
}

const initialState: AuthState = {
    token : Cookies.get('authToken') || null,
    user: null,
    isAuthenticated: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers : {
        loginSuccess : (state, action: PayloadAction<{token : string, user: User; isAuthenticated: boolean}>) => {
            state.token = action.payload.token
            state.user = action.payload.user
            state.isAuthenticated = true
            Cookies.set('authToken', action.payload.token, {expires:1/24})
        },
        logout : (state) => {
            state.token = null
            state.user = null
            state.isAuthenticated = false;
            Cookies.remove('authToken')
        },
        updateUser: (state, action: PayloadAction<{user: User}>) => {
            state.user = action.payload.user
            if(state.token) {
                Cookies.set('authToken', state.token, {expires: 1/24})
            }
        }
    }
})

export const {loginSuccess, logout, updateUser} = authSlice.actions;
export default authSlice.reducer;
