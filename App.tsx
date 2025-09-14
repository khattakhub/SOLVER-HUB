import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

const HomePage = lazy(() => import('./pages/HomePage'));
const ToolsPage = lazy(() => import('./pages/ToolsPage'));
const ToolDetailPage = lazy(() => import('./pages/ToolDetailPage'));
const FutureToolsPage = lazy(() => import('./pages/FutureToolsPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));


const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary dark:border-sky-400"></div>
    </div>
);

const App: React.FC = () => {
    return (
        <HashRouter>
            <div className="flex flex-col min-h-screen font-sans">
                <Header />
                <main className="flex-grow">
                    <Suspense fallback={<LoadingSpinner />}>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/tools" element={<ToolsPage />} />
                            <Route path="/tools/:toolId" element={<ToolDetailPage />} />
                            <Route path="/future" element={<FutureToolsPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route 
                                path="/admin" 
                                element={
                                    <ProtectedRoute>
                                        <AdminPage />
                                    </ProtectedRoute>
                                } 
                            />
                        </Routes>
                    </Suspense>
                </main>
                <Footer />
            </div>
        </HashRouter>
    );
};

export default App;