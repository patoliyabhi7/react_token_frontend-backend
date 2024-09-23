import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm.jsx";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import { Container, Box } from "@mui/material";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "./apiServices";
import { jwtDecode } from "jwt-decode";
import Profile from "./components/Profile.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import ResetPassword from "./components/ResetPassword.jsx";
import Sidebar from "./components/Sidebar.jsx";

const AuthWrapper = () => {
  const token = localStorage.getItem("jwt");

  const isTokenExpired = (token) => {
    if (!token) return true;

    try {
      // const { exp } = jwtDecode(token);
      // if (!exp) return true;
      // const currentTime = Date.now() / 1000; // Convert to seconds
      // return exp < currentTime;
    } catch (error) {
      console.error("Invalid token", error);
      return true;
    }
  };

  const isExpired = isTokenExpired(token);

  return isExpired ? <Navigate to="/" replace /> : <Outlet />;
};

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return (
    <Router>
      <Box sx={{ display: "flex" }}>
        <Navigation />
        <Sidebar />
        <Container sx={{ flexGrow: 1, padding: 3 }}>
          <Box sx={{ my: 4 }}>
            <Routes>
              <Route path="/" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              <Route element={<AuthWrapper />}>
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Routes>
          </Box>
        </Container>
      </Box>
    </Router>
  );
}

export default App;
