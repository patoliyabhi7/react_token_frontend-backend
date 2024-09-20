import { useState } from 'react';
import axios from 'axios';
import { loginStart, loginFailure, loginSuccess, signupStart, signupSuccess, signupFailure } from './features/users/userSlice';

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