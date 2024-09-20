import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm.jsx";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import { Container, Box } from "@mui/material";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "./apiServices";
import {jwtDecode} from "jwt-decode";
import Profile from "./components/Profile.jsx";

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
      <Navigation />
      <Container>
        <Box sx={{ my: 4 }}>
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            {/* <Route path="/home" element={<Home />} /> */}
            <Route element={<AuthWrapper />}>
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </Box>
      </Container>
    </Router>
  );
}

export default App;