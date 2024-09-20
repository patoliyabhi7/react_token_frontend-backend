import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Avatar, Card, CardContent, Grid, Button, TextField, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { updatePassword } from "../apiServices";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Profile() {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const {register, handleSubmit, formState: { errors },} = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {

      const result = await dispatch(updatePassword(data));
      if(result.status === "success") {
        toast.success('Always at the bottom.', {
          position: "bottom-right"
        })
      }
    } catch (error) {
      console.error("An error occurred:", error.statusMessage);
      const errorMessage = error.statusMessage
        ? error.statusMessage
        : "An unexpected error occurred";
      setErrorMessage(errorMessage);
    }
  };

  const passwordFormRef = useRef(null);

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const handleChangePassword = () => {
    setShowPasswordForm(!showPasswordForm);
    if (!showPasswordForm) {
      // Scroll to the password form
      setTimeout(() => {
        passwordFormRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100); // Delay to ensure the form is rendered
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value,
    });
  };

  const handleSubmitPasswordChange = () => {
    // Implement password change logic here
    console.log("Password change submitted:", passwords);
    // Reset form and hide it
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    // setShowPasswordForm(false);
  };

  return (
    <>
      <Box sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
        <ToastContainer />
        <Card sx={{ maxWidth: 600, width: "100%", p: 3, boxShadow: 3 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar sx={{ width: 80, height: 80, mr: 3 }}>
                {user?.name?.charAt(0)}
              </Avatar>
              <Typography variant="h4" component="div">
                {user ? `Welcome, ${user.name}` : "Welcome to Your Profile"}
              </Typography>
            </Box>
            {user ? (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" color="textSecondary">
                    Name:
                  </Typography>
                  <Typography variant="body1">{user.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" color="textSecondary">
                    Email:
                  </Typography>
                  <Typography variant="body1">{user.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" color="textSecondary">
                    Username:
                  </Typography>
                  <Typography variant="body1">{user.username}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" color="textSecondary">
                    Gender:
                  </Typography>
                  <Typography variant="body1">{user.gender}</Typography>
                </Grid>
              </Grid>
            ) : (
              <Typography variant="h6" color="error">
                Error fetching user data or No user data available.
              </Typography>
            )}
            <Box
              sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditProfile}
              >
                Edit Profile
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleChangePassword}
              >
                Change Password
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Box
        sx={{ mt: 5, display: "flex", justifyContent: "center" }}
        ref={passwordFormRef}
      >
        {showPasswordForm && (
          <Box
            onSubmit={handleSubmit(onSubmit)}
            sx={{ maxWidth: 600, width: "100%", p: 3, boxShadow: 3 }}
          >
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            <TextField
                fullWidth
                label="Current Password"
                margin="normal"
                {...register('current password', { required: 'Current password is required' })}
                error={!!errors.currentPassword}
                helperText={errors.currentPassword ? errors.currentPassword.message : ''}
            />
            
            <TextField
                fullWidth
                label="Password"
                margin="normal"
                {...register('password', { required: 'Password is required' })}
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ''}
            />
            <TextField
                fullWidth
                label="Confirm Password"
                margin="normal"
                {...register('confirmPassword', { required: 'Confirm Password is required' })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword ? errors.confirmPassword.message : ''}
            />
           
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={onSubmit}
            >
              Submit
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
}

export default Profile;

// toaster notification
// const notify = () => toast("Wow so easy!");

// <button onClick={notify}>Notify!</button>
// <ToastContainer />
