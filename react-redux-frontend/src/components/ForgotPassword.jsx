import React, { useState } from "react";
import { forgotPassword } from "../apiServices";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true); // Disable the button
      const result = await dispatch(forgotPassword(data));
      if (result.status === "success") {
        toast.success("Password Reset Link Sent Please check your mail", {
          position: "bottom-right",
        });
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
      <Typography variant="overline" gutterBottom sx={{ display: 'block', fontSize: '1.5rem', alignSelf:'center'}}>
                forgot password
            </Typography>

      <Typography variant="body1" gutterBottom>
        Enter your email and we'll send you a link to reset your password
      </Typography>
      <TextField
        fullWidth
        label="Email"
        margin="normal"
        {...register("email", { required: "Email is required" })}
        error={!!errors.email}
        helperText={errors.email ? errors.email.message : ""}
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

export default ForgotPassword;