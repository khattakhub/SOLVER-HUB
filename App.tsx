import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { useSiteSettings } from './contexts/SiteSettingsContext';
import ContactPage from './pages/contact';
import SuggestionPage from './pages/suggest';

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

const AppContent: React.FC = () => {
    const { settings } = useSiteSettings();
    const location = useLocation();

    useEffect(() => {
        if (settings.siteName) {
            document.title = settings.siteName;
        }
    }, [settings.siteName]);

    const showFooter = location.pathname === '/';

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
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                        <Route path="/sitemap" element={<SitemapPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/suggest" element={<SuggestionPage />} />
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
            {showFooter && <Footer />}
        </div>
    );
}

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
};

export default App;
