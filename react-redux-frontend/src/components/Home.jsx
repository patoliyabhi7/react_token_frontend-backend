import React from "react";
import { useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";

function Home() {
  const user = useSelector((state) => state.user.user);

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h4" gutterBottom>
        Home
      </Typography>
    </Box>
  );
}

export default Home;
