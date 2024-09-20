import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../apiServices';

function LoginForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const onSubmit = async(data) => {
        const result = await dispatch(login(data));
        if (result.status === "success") {
          navigate('/home'); 
        }
      };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <Typography variant="h4" gutterBottom>Login</Typography>
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
    );
};

export default LoginForm;