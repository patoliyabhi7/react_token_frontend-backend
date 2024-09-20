import React from "react";
import { useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";

function Home() {
  const user = useSelector((state) => state.user.user);

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Your Profile
      </Typography>
      {user ? (
        <Box>
          <Typography variant="h6">Name: {user.name}</Typography>
          <Typography variant="h6">Email: {user.email}</Typography>
          <Typography variant="h6">Username: {user.username}</Typography>
          <Typography variant="h6">Gender: {user.gender}</Typography>
        </Box>
      ) : (
        <Typography variant="h6">No user data available.</Typography>
      )}
    </Box>
  );
}

export default Home;