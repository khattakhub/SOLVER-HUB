import React, { lazy, Suspense } from 'react';
// FIX: Corrected import for react-router-dom components.
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CodeIcon = lazy(() => import('../components/icons').then(module => ({ default: module.CodeIcon })));

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAdmin, loading } = useAuth();

    if (loading) {
        return (
             <div className="flex justify-center items-center h-screen">
                <div className="relative w-24 h-24 overflow-hidden">
                    <Suspense fallback={<div>...</div>}>
                        <CodeIcon className="w-24 h-24 text-primary" />
                    </Suspense>
                    <div 
                        className="absolute top-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent transform -skew-x-12"
                        style={{animation: 'shine 2s infinite linear'}}
                    />
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;