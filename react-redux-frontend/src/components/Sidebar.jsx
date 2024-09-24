import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddTaskIcon from "@mui/icons-material/AddTask";
import ChecklistIcon from "@mui/icons-material/Checklist";
import { Link, useLocation } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";

const drawerWidth = 200;

export default function Sidebar() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100); // Adjust the delay as needed

    return () => clearTimeout(timer);
  }, []);

  const isActive = (path) => location.pathname === path;

  const activeStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    fontWeight: "bold",
    color: "#1976d2",
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#f5f5f5",
            boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Typography
            variant="overline"
            gutterBottom
            sx={{
              flexGrow: 1,
              display: "block",
              fontSize: "1rem",
              alignSelf: "center",
            }}
          >
            Dashboard
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          {loading ? (
            // Render skeletons while loading
            Array.from(new Array(4)).map((_, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <Skeleton variant="circular" width={24} height={24} />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Skeleton variant="text" width={100} />}
                  />
                </ListItemButton>
              </ListItem>
            ))
          ) : (
            // Render actual content when not loading
            <>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/home"
                  sx={{
                    ...(isActive("/home") ? activeStyle : {}),
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.05)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ color: isActive("/home") ? "#1976d2" : "inherit" }}
                  >
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/profile"
                  sx={{
                    ...(isActive("/profile") ? activeStyle : {}),
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.05)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ color: isActive("/profile") ? "#1976d2" : "inherit" }}
                  >
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItemButton>
              </ListItem>
              <Divider sx={{ m: 0.5 }} />

              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/add-task"
                  sx={{
                    ...(isActive("/add-task") ? activeStyle : {}),
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.05)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive("/add-task") ? "#1976d2" : "inherit",
                    }}
                  >
                    <AddTaskIcon />
                  </ListItemIcon>
                  <ListItemText primary="Add Task" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/all-task"
                  sx={{
                    ...(isActive("/all-task") ? activeStyle : {}),
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.05)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive("/all-task") ? "#1976d2" : "inherit",
                    }}
                  >
                    <ChecklistIcon />
                  </ListItemIcon>
                  <ListItemText primary="All Task" />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </Box>
  );
}