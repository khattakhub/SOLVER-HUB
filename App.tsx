import React, { Suspense, lazy, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { useSiteSettings } from './contexts/SiteSettingsContext';
import LoadingIndicator from './components/LoadingIndicator';
import { isFirebaseInitialized } from './services/firebase';

const HomePage = lazy(() => import('./pages/HomePage'));
const ToolsPage = lazy(() => import('./pages/ToolsPage'));
const ToolDetailPage = lazy(() => import('./pages/ToolDetailPage'));
const FutureToolsPage = lazy(() => import('./pages/FutureToolsPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const SitemapPage = lazy(() => import('./pages/SitemapPage'));


const FirebaseConnectionBanner = () => {
    if (isFirebaseInitialized) {
        return null;
    }

    return (
        <div 
            className="bg-red-600 text-white text-center p-2 text-sm font-semibold z-50 sticky top-0"
            role="alert"
        >
            <strong>Configuration Incomplete:</strong> Firebase services are not connected. Admin, login, and contact features will not work. Please configure Firebase environment variables in the deployment settings.
        </div>
    );
};


const PageLayout: React.FC = () => {
    const location = useLocation();
    
    return (
        <div className="flex flex-col min-h-screen font-sans">
            <Header />
            <FirebaseConnectionBanner />
            <main className="flex-grow">
                <Suspense fallback={<LoadingIndicator />}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/tools" element={<ToolsPage />} />
                        <Route path="/tools/:toolId" element={<ToolDetailPage />} />
                        <Route path="/future" element={<FutureToolsPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                        <Route path="/sitemap" element={<SitemapPage />} />
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
            {location.pathname === '/' && <Footer />}
        </div>
    );
};


const App: React.FC = () => {
    const { settings } = useSiteSettings();

    useEffect(() => {
        if (settings.siteName) {
            document.title = settings.siteName;
        }
    }, [settings.siteName]);
    
    return (
        <HashRouter>
            <PageLayout />
        </HashRouter>
    );
};

export default App;