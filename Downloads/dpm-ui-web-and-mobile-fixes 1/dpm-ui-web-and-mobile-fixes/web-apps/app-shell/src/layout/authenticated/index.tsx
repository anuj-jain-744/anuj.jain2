import React from "react";
import { Outlet, Navigate } from "react-router-dom";

// ProtectedLayout component to protect routes that require authentication
const AuthenticatedLayout: React.FC = () => {
  // Placeholder for authentication logic
  const isAuthenticated = true; // Replace with actual authentication logic

  // If the user is not authenticated, redirect to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If authenticated, render the child components
  return (
    <div className="app-container">
      <Outlet />
    </div>
  );
};

export default AuthenticatedLayout;
