import React, { Suspense, lazy, useEffect } from 'react';
// FIX: Corrected import for react-router-dom components.
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { useSiteSettings } from './contexts/SiteSettingsContext';

const CodeIcon = lazy(() => import('./components/icons').then(module => ({ default: module.CodeIcon })));
const HomePage = lazy(() => import('./pages/HomePage'));
const ToolsPage = lazy(() => import('./pages/ToolsPage'));
const ToolDetailPage = lazy(() => import('./pages/ToolDetailPage'));
const FutureToolsPage = lazy(() => import('./pages/FutureToolsPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const SitemapPage = lazy(() => import('./pages/SitemapPage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const ContactUsPage = lazy(() => import('./pages/ContactUsPage'));
const DisclaimerPage = lazy(() => import('./pages/DisclaimerPage'));

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-screen">
        <div className="relative w-24 h-24 overflow-hidden">
            <CodeIcon className="w-24 h-24 text-primary" />
            <div 
                className="absolute top-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent transform -skew-x-12"
                style={{animation: 'shine 2s infinite linear'}}
            />
        </div>
    </div>
);

const App: React.FC = () => {
    const { settings } = useSiteSettings();
    const location = useLocation();

    useEffect(() => {
        if (settings.siteName) {
            document.title = settings.siteName;
        }
    }, [settings.siteName]);
    
    return (
        <div className="flex flex-col min-h-screen font-sans">
            <Header />
            <main className="flex-grow">
                <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/tools" element={<ToolsPage />} />
                        <Route path="/tools/:toolId" element={<ToolDetailPage />} />
                        <Route path="/future" element={<FutureToolsPage />} />
                        <Rout  path="/login" element={<LoginPage />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                        <Route path="/sitemap" element={<SitemapPage />} />
                        <Route path="/about" element={<AboutUsPage />} />
                        <Route path="/contact" element={<ContactUsPage />} />
                        <Route path="/disclaimer" element={<DisclaimerPage />} />
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

export default App;