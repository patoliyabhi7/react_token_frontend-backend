import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout";
import AppRoutes from "./routes";
import "./App.css";
import Navigation from "./components/Navigation";

function App() {
  return (
    <Router>
      <Navigation />
      <AppRoutes />
    </Router>
  );
}

export default App;
