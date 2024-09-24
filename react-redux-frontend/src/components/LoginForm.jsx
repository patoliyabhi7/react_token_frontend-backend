import React, { useState } from 'react';
import { set, useForm } from 'react-hook-form';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../apiServices';

function LoginForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

    if (isAuthenticated) {
        navigate('/home');
    }

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            const result = await dispatch(login(data));
            if (result.status === "success") {
                navigate('/home');
            }
        } catch (error) {
            console.error('An error occurred:', error);
            const errorMessage = error.statusMessage ? error.statusMessage : 'An unexpected error occurred';
            setErrorMessage(errorMessage);
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* {localStorage.removeItem('jwt')} */}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{
                mt: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start', // Align items to the start (left)
                maxWidth: 400,
                mx: 'auto',
                p: 3, boxShadow: 3
            }}>
            <Typography variant="overline" gutterBottom sx={{ display: 'block', fontSize: '1.5rem', alignSelf:'center'}}>
                login
            </Typography>
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
                <Button type="submit" variant="contained" color="primary"
                 disabled={isLoading} sx={{ mt: 2, alignSelf: 'flex-start' }}>
                    {isLoading ? 'Loading...' : 'Login'}
                </Button>
                <Button
                    color="secondary"
                    sx={{ mt: 1 }}
                    onClick={() => navigate('/forgot-password')}
                >
                    Forgot Password?
                </Button>
            </Box>
        </>
    );
}

export default LoginForm;