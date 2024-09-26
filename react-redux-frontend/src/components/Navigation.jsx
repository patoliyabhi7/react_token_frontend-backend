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
} from "@mui/material";

const Navigation = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("jwt");

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
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
    <div>
      <AppBar position="fixed">
        <Toolbar>
          {!isAuthenticated ? (
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
                {/* Assuming you have a user object with a name */}
                {/* Replace 'U' with user?.name?.charAt(0) if you have user data */}
                {/* {user?.name?.charAt(0)} */}
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
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navigation;
