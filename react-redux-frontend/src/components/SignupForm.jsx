import React from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Box, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signup } from '../apiServices';

const SignupForm = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Watch the password field to compare it with confirmPassword
    const password = watch('password');

    const onSubmit = async (data) => {
        const result = await dispatch(signup(data));
        if (!result.error) {
            navigate('/');
        }
    }

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <Typography variant="h4" gutterBottom>Signup</Typography>
            <TextField
                fullWidth
                label="Name"
                margin="normal"
                {...register('name', { 
                    required: 'Name is required', 
                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                })}
                error={!!errors.name}
                helperText={errors.name ? errors.name.message : ''}
            />
            <TextField
                fullWidth
                label="Email"
                margin="normal"
                {...register('email', { 
                    required: 'Email is required', 
                    pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message: 'Invalid email address' }
                })}
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ''}
            />
            <TextField
                fullWidth
                label="Username"
                margin="normal"
                {...register('username', { 
                    required: 'Username is required', 
                    minLength: { value: 3, message: 'Username must be at least 3 characters' },
                    pattern: { value: /^\S*$/, message: 'Username cannot contain spaces' }
                })}
                error={!!errors.username}
                helperText={errors.username ? errors.username.message : ''}
            />
            <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                {...register('password', { 
                    required: 'Password is required', 
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    pattern: { value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, message: 'Password must contain letters and numbers' }
                })}
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ''}
            />
            <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                margin="normal"
                {...register('confirmPassword', { 
                    required: 'Confirm Password is required',
                    validate: value => value === password || 'Password & Confirm Password do not match'
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword ? errors.confirmPassword.message : ''}
            />
            <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">Gender</FormLabel>
                <RadioGroup row aria-label="gender" {...register('gender', { required: "Gender is required" })}>
                    <FormControlLabel value="Male" control={<Radio />} label="Male" />
                    <FormControlLabel value="Female" control={<Radio />} label="Female" />
                    <FormControlLabel value="other" control={<Radio />} label="Other" />
                </RadioGroup>
                {errors.gender && <Typography color="error">{errors.gender.message}</Typography>}
            </FormControl>
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                Signup
            </Button>
        </Box>
    );
};

export default SignupForm;