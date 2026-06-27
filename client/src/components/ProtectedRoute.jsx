import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to login, but save the location they were trying to go to so we can send them back      
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}