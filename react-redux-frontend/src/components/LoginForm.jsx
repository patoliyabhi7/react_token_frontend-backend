// loginform.jsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useLoginMutation } from "./../apiService";
import { useAuth } from "./../utils/AuthContext";

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [loginMutation, { data, isLoading, error }] = useLoginMutation();
  const { login: authLogin } = useAuth(); // Rename login to authLogin

  const onSubmit = async (formData) => {
    try {
      const result = await loginMutation(formData).unwrap();
      if (result.token) {
        authLogin(result.token);
        const from = location.state?.from?.pathname || "/home";
        navigate(from, { replace: true });
      }
    } catch (err) {
      setErrorMessage(err.data?.message || "An unexpected error occurred");
    }
  };

  useEffect(() => {
    if (error) {
      const errorMessage =
        error?.data?.message || "An unexpected error occurred";
      setErrorMessage(errorMessage);
    }
  }, [error]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        mt: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        maxWidth: 400,
        mx: "auto",
        p: 3,
        boxShadow: 3,
      }}
    >
      <Typography
        variant="overline"
        gutterBottom
        sx={{ display: "block", fontSize: "1.5rem", alignSelf: "center" }}
      >
        Login
      </Typography>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <TextField
        fullWidth
        label="Email"
        margin="normal"
        {...register("email", { required: "Email is required" })}
        error={!!errors.email}
        helperText={errors.email ? errors.email.message : ""}
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        {...register("password", { required: "Password is required" })}
        error={!!errors.password}
        helperText={errors.password ? errors.password.message : ""}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isLoading}
        sx={{ mt: 2, alignSelf: "flex-start" }}
      >
        {isLoading ? "Loading..." : "Login"}
      </Button>
      <Button
        color="secondary"
        sx={{ mt: 1 }}
        onClick={() => navigate("/forgot-password")}
      >
        Forgot Password?
      </Button>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Don't have an account?{" "}
        <Button
          color="primary"
          variant="text"
          onClick={() => navigate("/signup")}
        >
          Signup
        </Button>
      </Typography>
    </Box>
  );
}

export default LoginForm;
