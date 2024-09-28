import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";
import "./App.css";
import Navigation from "./components/Navigation";
import { AuthProvider, useAuth } from "./utils/AuthContext";
import { Box, CircularProgress } from "@mui/material";
import ErrorBoundary from "./ErrorBoundary";

const LoadingSpinner = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "calc(100vh - 64px)",
    }}
  >
    <CircularProgress />
  </Box>
);

const AppContent = () => {
  const { isLoading } = useAuth();

  return <>{isLoading ? <LoadingSpinner /> : <AppRoutes />}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </Router>
    </AuthProvider>
  );
}

export default App;
