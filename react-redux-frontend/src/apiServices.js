import { useState } from 'react';
import axios from 'axios';
import {
    loginStart, loginFailure, loginSuccess,
    signupStart, signupSuccess, signupFailure,
    updatePasswordStart, updatePasswordSuccess,
    passwordResetStart, passwordResetSuccess, passwordResetError,
    addTaskStart, addTaskSuccess, addTaskFailure,
    getCurrentUserTasksStart, getCurrentUserTasksSuccess, getCurrentUserTasksFailure,
    deleteTaskStart, deleteTaskSuccess, deleteTaskFailure,
    getTaskByIdStart, getTaskByIdSuccess, getTaskByIdFailure,
    updateTaskStart, updateTaskSuccess, updateTaskFailure,
} from './features/users/userSlice';

const API_BASE_URL = 'http://localhost:8001/api/v1/users';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
})

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},
    (error) => {
        return Promise.reject(error);
    }
)

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Request a new access token using the refresh token
                const response = await axios.post(`${API_BASE_URL}/refreshToken`, {}, { withCredentials: true });
                const { accessToken } = response.data;
                localStorage.setItem('jwt', accessToken);

                // Update the Authorization header and retry the original request
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                console.error('Refresh token failed', refreshError);
                localStorage.removeItem('jwt');
                // Optionally, redirect to login page
            }
        }
        return Promise.reject(error);
    }
);

export const signup = (userData) => async (dispatch) => {
    dispatch(signupStart());
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, userData, { withCredentials: true });
        const { token } = response.data;

        // Store the JWT token in local storage
        localStorage.setItem('jwt', token);

        // Fetch the current user data
        const userResponse = await apiClient.get('/getCurrentUser');
        const user = userResponse.data.user;

        // Update the Redux store with user data
        dispatch(signupSuccess({ user, token }));

        return Promise.resolve(response.data);
    } catch (error) {
        const errorMessage = error.response ? error.response.data : 'Network Error';
        dispatch(signupFailure(errorMessage));
        return Promise.reject(errorMessage);
    }
};

export const login = (credentials) => async (dispatch) => {
    dispatch(loginStart());
    try {
        const response = await apiClient.post(`/login`, credentials);
        const { token, response: { user } } = response.data;

        localStorage.setItem('jwt', token);
        dispatch(loginSuccess(user));

        return Promise.resolve(response.data);
    } catch (error) {
        const errorMessage = error.response ? error.response.data : 'Network Error';
        dispatch(loginFailure(errorMessage));
        return Promise.reject(errorMessage);
    }
};

export const fetchCurrentUser = () => async (dispatch) => {
    try {
        const response = await apiClient.get('/getCurrentUser');
        dispatch(loginSuccess(response.data.user));
    } catch (error) {
        const errorMessage = error.response ? error.response.data : 'Network Error';
        dispatch(loginFailure(errorMessage));
    }
};

export const updatePassword = (credentials) => async (dispatch) => {
    try {
        dispatch(updatePasswordStart());
        const response = await apiClient.post('/updatePassword', credentials);
        dispatch(updatePasswordSuccess());
        return Promise.resolve(response.data);
    } catch (error) {
        const errorMessage = error.response ? error.response.data.statusMessage : 'Network Error';
        dispatch(loginFailure(errorMessage)); // Assuming you have a failure action for updatePassword
        return Promise.reject(errorMessage);
    }
};

export const forgotPassword = (email) => async (dispatch) => {
    try {
        const response = await apiClient.post('/forgotPassword', { email });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error.response.data);
    }
}

export const resetPassword = (token, data) => async (dispatch) => {
    try {
        dispatch(passwordResetStart());
        const response = await apiClient.post(`/resetPassword/${token}`, data);
        dispatch(passwordResetSuccess());
        return Promise.resolve(response.data);
    } catch (error) {
        dispatch(passwordResetError(error.response.data));
        return Promise.reject(error.response.data);
    }
}

export const jsonData = async () => {
    try {
        const response = await axios.get('https://mocki.io/v1/4ef316c4-00d2-409a-82aa-1478d6f9dd8e');
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error.response.data);
    }
}

export const addTask = (task) => async (dispatch) => {
    try {
        dispatch(addTaskStart());
        const response = await apiClient.post('/tasks', task);
        dispatch(addTaskSuccess(response.data));
        return Promise.resolve(response.data);
    } catch (error) {
        console.log("error: ", error)
        dispatch(addTaskFailure(error.response, error.response));
        return Promise.reject(error.response);
    }
}

export const getCurrentUserTasks = () => async (dispatch) => {
    try {
        dispatch(getCurrentUserTasksStart());
        const response = await apiClient.get('/tasks');
        dispatch(getCurrentUserTasksSuccess(response.data));
        return Promise.resolve(response.data);
    } catch (error) {
        dispatch(getCurrentUserTasksFailure(error.response));
        return Promise.reject(error.response);
    }
}

export const deleteTask = (taskId) => async (dispatch) => {
    try {
        dispatch(deleteTaskStart());
        const response = await apiClient.delete(`/tasks/${taskId}`);
        dispatch(deleteTaskSuccess(taskId));
        return Promise.resolve(response.data);
    } catch (error) {
        console.log("apiServices error: ", error)
        dispatch(deleteTaskFailure(error.response));
        return Promise.reject(error.response);
    }
}

export const getTaskById = (taskId) => async (dispatch) => {
    try {
        dispatch(getTaskByIdStart());
        console.log("start")
        const response = await apiClient.get(`/tasks/${taskId}`);
        console.log("start")
        dispatch(getTaskByIdSuccess(response.data));
        return Promise.resolve(response.data);
    }
    catch (error) {
        console.log("error", error)
        dispatch(getTaskByIdFailure(error.response));
        return Promise.reject(error.response);
    }
}

export const updateTask = (taskId, task) => async (dispatch) => {
    try {
        dispatch(updateTaskStart());
        const response = await apiClient.put(`/tasks/${taskId.id}`, taskId);
        dispatch(updateTaskSuccess(response.data));
        return Promise.resolve(response.data);
    } catch (error) {
        dispatch(updateTaskFailure(error.response));
        return Promise.reject(error.response);
    }
}