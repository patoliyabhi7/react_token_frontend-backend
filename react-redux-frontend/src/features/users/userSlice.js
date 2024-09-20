import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    status: 'idle',
    error: null,
    isAuthenticated: false, 
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginStart(state) {
            state.status = 'loading';
        },
        loginSuccess(state, action) {
            state.status = 'succeeded';
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        loginFailure(state, action) {
            state.status = 'failed';
            state.error = action.payload;
        },
        signupStart(state) {
            state.status = 'loading';
        },
        signupSuccess(state, action) {
            state.status = 'succeeded';
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
        signupFailure(state, action) {
            state.status = 'failed';
            state.error = action.payload;
        },
        logout(state) {
            state.user = null;
            state.error = null;
            state.status = 'idle';
            state.isAuthenticated = false; 
        }
    }
});

export const { loginStart, loginSuccess, loginFailure, signupStart, signupSuccess, signupFailure, logout } = userSlice.actions;

export default userSlice.reducer;