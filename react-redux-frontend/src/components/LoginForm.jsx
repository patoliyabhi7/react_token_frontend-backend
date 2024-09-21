import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../apiServices';

function LoginForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (data) => {
        try {
            const result = await dispatch(login(data));
            if (result.status === "success") {
                navigate('/home');
            }
        } catch (error) {
            // Check if error.response exists and extract the message
            console.error('An error occurred:', error.statusMessage);
            const errorMessage = error.statusMessage ? error.statusMessage : 'An unexpected error occurred';
            setErrorMessage(errorMessage); // Set the error message as a string
        }
    };
    return (
        <>
        {localStorage.removeItem('jwt')}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{
                    mt: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    maxWidth: 400,
                    mx: 'auto',
                    p: 3, boxShadow: 3
                    }}>
                <Typography variant="h4" gutterBottom>Login</Typography>
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                <TextField
                    fullWidth
                    label="Email"
                    margin="normal"
                    {...register('email', { required: 'Email is required' })}
                    error={!!errors.email}
                    helperText={errors.email ? errors.email.message : ''}
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    margin="normal"
                    {...register('password', { required: 'Password is required' })}
                    error={!!errors.password}
                    helperText={errors.password ? errors.password.message : ''}
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Login
                </Button>
            </Box>
            
        </>
    );
};

export default LoginForm;