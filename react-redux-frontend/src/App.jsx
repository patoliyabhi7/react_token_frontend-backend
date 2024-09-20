import React, { useEffect } from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm.jsx";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import { Container, Box } from "@mui/material";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "./apiServices";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

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
            <Route path="/home" element={<Home />} />
          </Routes>
        </Box>
      </Container>
    </Router>
  );
}

export default App;
