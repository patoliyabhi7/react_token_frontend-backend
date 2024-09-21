import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { updatePassword } from "../apiServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Profile() {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // Import the reset function
  } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(updatePassword(data));
      console.log(result);
      if (result.status === "success") {
        toast.success("Password updated successfully.", {
          position: "bottom-right",
        });
        setErrorMessage("");
        setShowPasswordForm(false);
        reset();
      }
    } catch (error) {
      console.error("An error occurred:", error);
      const errorMessage = error ? error : "An unexpected error occurred";
      setErrorMessage(errorMessage);
      console.log(error);
    }
  };

  const passwordFormRef = useRef(null);

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const handleChangePassword = () => {
    setShowPasswordForm(!showPasswordForm);
    if (!showPasswordForm) {
      setTimeout(() => {
        passwordFormRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
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
            component="form"
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
              type="password"
              margin="normal"
              {...register("currentPassword", {
                required: "Current password is required",
              })}
              error={!!errors.currentPassword}
              helperText={
                errors.currentPassword ? errors.currentPassword.message : ""
              }
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              margin="normal"
              {...register("password", {
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                  message: "Password must contain letters and numbers",
                },
              })}
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ""}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              margin="normal"
              type="password"
              {...register("confirmPassword", {
                required: "Confirm password is required",
              })}
              error={!!errors.confirmPassword}
              helperText={
                errors.confirmPassword ? errors.confirmPassword.message : ""
              }
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
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
