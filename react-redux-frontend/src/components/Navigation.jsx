import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Button, Box, Avatar, Menu, MenuItem, Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./../features/users/userSlice";

const drawerWidth = 240;

function Navigation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const user = useSelector((state) => state.user.user); 
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    setAnchorEl(null);
    localStorage.removeItem("jwt");
    dispatch(logout());
    navigate("/");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
       <AppBar
        position="fixed"
        // sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
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
          {isAuthenticated && (
            <>
             
              <Box sx={{ flexGrow: 1 }} />
              <Avatar
                sx={{ cursor: 'pointer' }}
                onClick={handleMenuOpen}
              >
                {user?.name?.charAt(0)} {/* Display user's initial */}
              </Avatar>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>Settings</MenuItem>
                <Divider/>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Navigation;