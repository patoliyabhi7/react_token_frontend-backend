import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import { useResetPasswordMutation } from "../apiService";
import { ContactlessOutlined } from "@mui/icons-material";

function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();
  const [resetPassword, { data, isLoading, error }] =
    useResetPasswordMutation();

  const password = watch("password");

  const onSubmit = async (datas) => {
    resetPassword({ data: datas, token: token });
  };

  useEffect(() => {
    if (data !== undefined) {
      if (data.statusCode === 200) {
        navigate("/");
      } else {
        setErrorMessage(data.message);
      }
    } else if (error) {
      const errorMessage =
        error?.data?.message || "An unexpected error occurred";
      setErrorMessage(errorMessage);
    }
  }, [data, error]);

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
      <Typography
        variant="overline"
        gutterBottom
        sx={{ display: "block", fontSize: "1.5rem" }}
      >
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
