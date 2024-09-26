import React from "react";
import { Box, Typography, Button, Container, Paper } from "@mui/material";

function Home() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to right, #A3BEDA, #327AC2)",
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ padding: 4, textAlign: "center" }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome to Our Website!
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            We are glad to have you here. Explore our features and enjoy your stay!
          </Typography>
          <Button variant="contained" color="primary" size="large">
            Get Started
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

export default Home;