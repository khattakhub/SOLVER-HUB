import React, { Suspense, lazy } from 'react';
// Fix: Use namespace import for react-router-dom to avoid module resolution errors.
import * as ReactRouterDOM from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ApiKeyErrorBanner from './components/ApiKeyErrorBanner';

const HomePage = lazy(() => import('./pages/HomePage'));
const ToolsPage = lazy(() => import('./pages/ToolsPage'));
const ToolDetailPage = lazy(() => import('./pages/ToolDetailPage'));
const FutureToolsPage = lazy(() => import('./pages/FutureToolsPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const SitemapPage = lazy(() => import('./pages/SitemapPage'));


const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary dark:border-sky-400"></div>
    </div>
);

const App: React.FC = () => {
    return (
        <ReactRouterDOM.HashRouter>
            <div className="flex flex-col min-h-screen font-sans">
                <Header />
                <ApiKeyErrorBanner />
                <main className="flex-grow">
                    <Suspense fallback={<LoadingSpinner />}>
                        <ReactRouterDOM.Routes>
                            <ReactRouterDOM.Route path="/" element={<HomePage />} />
                            <ReactRouterDOM.Route path="/tools" element={<ToolsPage />} />
                            <ReactRouterDOM.Route path="/tools/:toolId" element={<ToolDetailPage />} />
                            <ReactRouterDOM.Route path="/future" element={<FutureToolsPage />} />
                            <ReactRouterDOM.Route path="/login" element={<LoginPage />} />
                            <ReactRouterDOM.Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                            <ReactRouterDOM.Route path="/terms-of-service" element={<TermsOfServicePage />} />
                            <ReactRouterDOM.Route path="/sitemap" element={<SitemapPage />} />
                            <ReactRouterDOM.Route 
                                path="/admin" 
                                element={
                                    <ProtectedRoute>
                                        <AdminPage />
                                    </ProtectedRoute>
                                } 
                            />
                        </ReactRouterDOM.Routes>
                    </Suspense>
                </main>
                <Footer />
            </div>
        </ReactRouterDOM.HashRouter>
    );
};

export default App;