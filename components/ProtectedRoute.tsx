import React from 'react';
// Fix: Use namespace import for react-router-dom to avoid module resolution errors.
import * as ReactRouterDOM from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAdmin } = useAuth();

    if (!isAdmin) {
        return <ReactRouterDOM.Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;