import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    status: 'idle',
    error: null,
    isAuthenticated: false,
    passwordResetStatus: 'idle', 
    passwordResetError: null,
    tasks: [],    
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
        },
        updatePasswordStart(state) {
            state.status = 'loading';
        },
        updatePasswordSuccess(state) {
            state.status = 'succeeded';
        },
        passwordResetStart(state) {
            state.loading = true;
            state.success = false;
            state.error = null;
        },
        passwordResetSuccess(state) {
            state.loading = false;
            state.success = true;
        },
        passwordResetError(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        addTaskStart(state) {
            state.status = 'loading';
        },
        addTaskSuccess(state, action) {
            state.status = 'succeeded';
            // state.tasks.push(action.payload);
        },
        addTaskFailure(state, action) {
            state.status = 'failed';
            state.error = action.payload;
        },
        getCurrentUserTasksStart(state){
            state.status = 'loading';
        },
        getCurrentUserTasksSuccess(state, action){
            state.status = 'succeeded';
            state.tasks = action.payload;
        },
        getCurrentUserTasksFailure(state, action){
            state.status = 'failed';
            state.error = action.payload;
        },
    }
});

export const { loginStart, loginSuccess, loginFailure,
    signupStart, signupSuccess, signupFailure,
    logout, updatePasswordStart, updatePasswordSuccess,
    passwordResetStart, passwordResetSuccess, passwordResetError,
    addTaskStart, addTaskSuccess, addTaskFailure,
    getCurrentUserTasksStart, getCurrentUserTasksSuccess, getCurrentUserTasksFailure
} = userSlice.actions;

export default userSlice.reducer;