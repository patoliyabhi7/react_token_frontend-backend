import React from "react";
import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Navigation />
      <Sidebar />
      <Container sx={{ flexGrow: 1, padding: 3 }}>
        <Box sx={{ my: 4 }}>
          <Outlet />
        </Box>
      </Container>
    </Box>
  );
};

export default Layout;