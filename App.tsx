import React, { Suspense, lazy, useEffect } from 'react';
// FIX: Corrected import for react-router-dom components.
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { useSiteSettings } from './contexts/SiteSettingsContext';
import LoadingIndicator from './components/LoadingIndicator';

const HomePage = lazy(() => import('./pages/HomePage'));
const ToolsPage = lazy(() => import('./pages/ToolsPage'));
const ToolDetailPage = lazy(() => import('./pages/ToolDetailPage'));
const FutureToolsPage = lazy(() => import('./pages/FutureToolsPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const SitemapPage = lazy(() => import('./pages/SitemapPage'));


const App: React.FC = () => {
    const { settings } = useSiteSettings();

    useEffect(() => {
        if (settings.siteName) {
            document.title = settings.siteName;
        }
    }, [settings.siteName]);
    
    return (
        <HashRouter>
            <div className="flex flex-col min-h-screen font-sans">
                <Header />
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
                <Footer />
            </div>
        </HashRouter>
    );
};

export default App;