import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Home from "./components/Home";
import Profile from "./components/Profile";
import AddTask from "./components/AddTask";
import Tasks from "./components/Tasks";
import { useSelector } from "react-redux";
import EditTask from "./components/EditTask";

const AuthWrapper = (st) => {
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

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route element={<AuthWrapper />}>
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/add-task" element={<AddTask />} />
        <Route path="/all-task" element={<Tasks />} />
        <Route path="/edit-task/:id" element={<EditTask />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
