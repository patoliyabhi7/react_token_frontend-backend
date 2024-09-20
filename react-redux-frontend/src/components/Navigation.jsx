import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./../features/users/userSlice";

function Navigation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    dispatch(logout());
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const activeStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    fontWeight: "bold",
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          {!isAuthenticated && (
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
          )}
          <Box sx={{ flexGrow: 1 }} />
          {isAuthenticated && (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Navigation;
