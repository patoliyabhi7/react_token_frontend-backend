import React, { useState, useRef, useEffect } from "react";
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
  Skeleton,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useGetCurrentUserQuery,
  useUpdatePasswordMutation,
} from "../apiService";

function Profile() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const {
    data: user,
    error: userError,
    isLoading: isUserLoading,
  } = useGetCurrentUserQuery();
  const [
    updatePassword,
    { isLoading: isUpdatingPassword, error: updateError },
  ] = useUpdatePasswordMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (updateError) {
      const errorMessage =
        updateError?.data?.message || "An unexpected error occurred";
      setErrorMessage(errorMessage);
    }
  }, [updateError]);

  useEffect(() => {
    if (userError && userError.status === 401) {
      localStorage.removeItem("jwt");
      navigate("/");
    }
  }, [userError, navigate]);

  const passwordFormRef = useRef(null);

  const handleEditProfile = () => {
    // navigate("/edit-profile");
  };
  const handleChangePassword = () => {
    setShowPasswordForm(!showPasswordForm);
    if (!showPasswordForm) {
      setTimeout(() => {
        passwordFormRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const onSubmit = async (formData) => {
    if (
      formData.currentPassword === formData.password &&
      formData.password === formData.confirmPassword
    ) {
      setErrorMessage(
        "New password cannot be the same as the current password"
      );
      return;
    }
    try {
      await updatePassword(formData).unwrap();
      toast.success("Password updated successfully.", {
        position: "bottom-right",
      });
      setErrorMessage("");
      setShowPasswordForm(false);
      reset();
    } catch (err) {
      const errorMessage = err?.data?.message || "An unexpected error occurred";
      setErrorMessage(errorMessage);
    }
  };

  const renderSkeletonLoader = () => (
    <Box sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
      <Card sx={{ maxWidth: 600, width: "100%", p: 3, boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Skeleton
              variant="circular"
              width={80}
              height={80}
              sx={{ mr: 3 }}
            />
            <Skeleton variant="text" width={200} height={40} />
          </Box>
          <Grid container spacing={2}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={12} sm={6} key={item}>
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="60%" />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );

  if (isUserLoading) {
    return renderSkeletonLoader();
  }

  if (userError) {
    return (
      <Box sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
        <Alert severity="error">
          Error loading user data. Please try again later.
        </Alert>
      </Box>
    );
  }
  return (
    <>
      <Box sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
        <ToastContainer />
        <Card sx={{ maxWidth: 600, width: "100%", p: 3, boxShadow: 3 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: "#1976d2" }}>
                {user?.user?.name?.charAt(0)}
              </Avatar>
              <Typography variant="h4" component="div">
                {user
                  ? `Welcome, ${user.user.name}`
                  : "Welcome to Your Profile"}
              </Typography>
            </Box>
            {user ? (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Name:
                  </Typography>
                  <Typography variant="body1">{user.user.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Email:
                  </Typography>
                  <Typography variant="body1">{user.user.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Username:
                  </Typography>
                  <Typography variant="body1">{user.user.username}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Gender:
                  </Typography>
                  <Typography variant="body1">{user.user.gender}</Typography>
                </Grid>
              </Grid>
            ) : (
              <Typography variant="h6" color="error">
                {userError
                  ? "Error fetching user data"
                  : "No user data available."}
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
                Update Password
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
      {showPasswordForm && (
        <Box
          sx={{ mt: 5, display: "flex", justifyContent: "center" }}
          ref={passwordFormRef}
        >
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ maxWidth: 600, width: "100%", p: 3, boxShadow: 3 }}
          >
            <Typography
              variant="overline"
              gutterBottom
              sx={{ display: "block", fontSize: "1.5rem", alignSelf: "center" }}
            >
              Update password
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
              disabled={isUpdatingPassword}
            >
              {isUpdatingPassword ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Update Password"
              )}
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
}

export default Profile;