// Navigation.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "./../utils/AuthContext";

const Navigation = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, logout } = useAuth();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/");
  };

  const isActive = (path) => {
    return window.location.pathname === path;
  };

  const activeStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    fontWeight: "bold",
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        {isLoading ? (
          <Box sx={{ flexGrow: 1 }} />
        ) : !isAuthenticated ? (
          <>
            <Button
              color="inherit"
              component={Link}
              to="/"
              style={isActive("/") ? activeStyle : {}}
            >
              Login
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/signup"
              style={isActive("/signup") ? activeStyle : {}}
            >
              Signup
            </Button>
          </>
        ) : (
          <>
            <Box sx={{ flexGrow: 1 }} />
            <Avatar sx={{ cursor: "pointer" }} onClick={handleMenuOpen}>
              {/* User avatar content */}
            </Avatar>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/settings");
                }}
              >
                Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        )}
        {isLoading && <CircularProgress color="inherit" size={24} />}
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;