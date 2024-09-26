import React, { useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "./../apiService";

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [login, { data, isLoading, error }] = useLoginMutation();

  const onSubmit = async (datas) => {
    login(datas);
  };
  useEffect(() => {
    if (data !== undefined) {
      localStorage.setItem('jwt', data.token)
      if (data.statusCode === 200) {
        navigate("/profile");
      } else {
        // else part here
      }
    } else if (error) {
      const errorMessage =
        error?.data?.message || "An unexpected error occurred";
      setErrorMessage(errorMessage);
    }
  }, [data, error]);

  return (
    <>
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
          login
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
      </Box>
    </>
  );
}

export default LoginForm;