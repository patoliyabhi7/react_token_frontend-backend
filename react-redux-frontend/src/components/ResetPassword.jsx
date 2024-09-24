import React, { useState } from "react";
import { resetPassword } from "../apiServices";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";

function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const {token} = useParams();
  const navigate = useNavigate();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      setIsLoading(true); 
      const result = await dispatch(resetPassword(token, data));
      if (result.status === "success") {
        toast.success("Password Reset Success", {
          position: "bottom-right",
        });
        navigate("/");
        setErrorMessage("");
        reset();
      }
    } catch (error) {
      console.error("An error occurred:", error.statusMessage);
      const errorMessage = error.statusMessage
        ? error.statusMessage
        : "An unexpected error occurred";
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false); // Re-enable the button
    }
  };

  
  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        mt: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: 400,
        mx: "auto",
        p: 3,
        boxShadow: 3,
      }}
    >
      <ToastContainer />
      <Typography variant="overline" gutterBottom sx={{ display: 'block', fontSize: '1.5rem' }}>
        reset password
      </Typography>
      <Typography variant="body1" gutterBottom>
        Enter new password and confirm password
      </Typography>
      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        {...register("password", {
          required: "Password is required",
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
        type="password"
        margin="normal"
        {...register("confirmPassword", {
          required: "Confirm Password is required",
          validate: (value) =>
            value === password || "Password & Confirm Password do not match",
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
        sx={{ mt: 2, mb: 2 }}
        disabled={isLoading} // Disable the button when loading
      >
        {isLoading ? "Sending..." : "Send Reset Link"}
      </Button>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
    </Box>
  );
}

export default ResetPassword;
