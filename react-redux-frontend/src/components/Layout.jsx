import React from "react";
import { Box, Container } from "@mui/material";
import Navigation from "./Navigation";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";

const Layout = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  return (
    <Box sx={{ display: "flex" }}>
      <Navigation />
      {isAuthenticated && <Sidebar />}
      <Container sx={{ flexGrow: 1, padding: 3 }}>
        <Box sx={{ my: 4 }}>{children}</Box>
      </Container>
    </Box>
  );
};

export default Layout;