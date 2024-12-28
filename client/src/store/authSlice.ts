import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface User {
    id: string,
    name: string,
    email: string,
    profilePhoto: string
}

interface AuthState {
    token : string | null,
    user: User | null;
}

const initialState: AuthState = {
    token : Cookies.get('authToken') || null,
    user: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers : {
        loginSuccess : (state, action: PayloadAction<{token : string, user: User}>) => {
            state.token = action.payload.token
            state.user = action.payload.user
            Cookies.set('authToken', action.payload.token, {expires:7})
        },
        logout : (state) => {
            state.token = null
            state.user = null
            Cookies.remove('authToken')
        } 
    }
})

export const {loginSuccess, logout} = authSlice.actions;
export default authSlice.reducer;