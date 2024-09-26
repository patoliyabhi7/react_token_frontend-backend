import React from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSignupMutation } from "./../apiService";

const SignupForm = () => {
  const [errorState, setErrorState] = React.useState(" ");
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const navigate = useNavigate();

  const [signup, { isLoading, isSuccess, isError, error }] =
    useSignupMutation();

  // Watch the password field to compare it with confirmPassword
  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const result = await signup(data).unwrap();
      if (result.status === "success") {
        navigate("/");
      }
    } catch (error) {
      console.error("Signup failed", error);
      let errorMessage = "An unexpected error occurred";
      if (error?.data?.message) {
        if (error.data.message.includes("email")) {
          errorMessage =
            "This email is already registered. Please use a different email.";
        } else if (error.data.message.includes("username")) {
          errorMessage =
            "This username is already taken. Please choose a different username.";
        } else {
          errorMessage = error.data.message;
        }
      }
      setErrorState(errorMessage);
    }
  };

  return (
    <>
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
        <Typography
          variant="overline"
          gutterBottom
          sx={{ display: "block", fontSize: "1.5rem", alignSelf: "center" }}
        >
          Signup
        </Typography>
        <TextField
          fullWidth
          label="Name"
          margin="normal"
          {...register("name", {
            required: "Name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
            },
          })}
          error={!!errors.name}
          helperText={errors.name ? errors.name.message : ""}
        />
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Invalid email address",
            },
          })}
          error={!!errors.email}
          helperText={errors.email ? errors.email.message : ""}
        />
        <TextField
          fullWidth
          label="Username"
          margin="normal"
          {...register("username", {
            required: "Username is required",
            minLength: {
              value: 3,
              message: "Username must be at least 3 characters",
            },
            pattern: {
              value: /^\S*$/,
              message: "Username cannot contain spaces",
            },
          })}
          error={!!errors.username}
          helperText={errors.username ? errors.username.message : ""}
        />
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
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Gender</FormLabel>
          <RadioGroup row aria-label="gender">
            <FormControlLabel
              value="Male"
              control={<Radio />}
              label="Male"
              {...register("gender", { required: "Gender is required" })}
            />
            <FormControlLabel
              value="Female"
              control={<Radio />}
              label="Female"
              {...register("gender", { required: "Gender is required" })}
            />
          </RadioGroup>
          {errors.gender && (
            <Typography color="error">{errors.gender.message}</Typography>
          )}
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Signup"}
        </Button>
        {isError && errorState && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorState}
          </Alert>
        )}
        {isSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Signup successful!
          </Alert>
        )}
        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Button color="primary" variant="text" onClick={() => navigate("/")}>
            Login
          </Button>
        </Typography>
      </Box>
    </>
  );
};

export default SignupForm;
