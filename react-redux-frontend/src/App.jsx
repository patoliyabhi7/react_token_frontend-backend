import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "./apiServices";
import Layout from "./components/Layout";
import AppRoutes from "./routes";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.user.status);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  
  return (
    <Router>
      <Layout>
        <AppRoutes />
      </Layout>
    </Router>
  );
}

export default App;