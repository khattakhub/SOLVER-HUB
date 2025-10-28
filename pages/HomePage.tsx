import React, { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const FeaturedToolsSection = lazy(() => import('../components/home/FeaturedToolsSection'));
const AboutSection = lazy(() => import('../components/home/AboutSection'));
const ContactSection = lazy(() => import('../components/home/ContactSection'));

const HomePage: React.FC = () => {
    const { settings } = useSiteSettings();

    const HeroSection = () => (
        <section className="bg-white dark:bg-dark py-20 sm:py-24 lg:py-32 transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 
                    className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-dark dark:text-light tracking-tight"
                    dangerouslySetInnerHTML={{ __html: settings.heroTitle }}
                >
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg text-secondary dark:text-slate-400">
                    {settings.heroSubtitle}
                </p>
                <div className="mt-10 flex justify-center space-x-4">
                    <Link to="/tools" className="bg-primary text-white font-semibold px-8 py-3 rounded-md hover:bg-primary-dark transition-colors duration-300 shadow-lg">
                        Explore All Tools
                    </Link>
                    <Link to="/future" className="bg-gray-200 text-secondary font-semibold px-8 py-3 rounded-md hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors duration-300">
                        Upcoming Features
                    </Link>
                </div>
            </div>
        </section>
    );

    return (
        <div className="fade-in">
            <HeroSection />
            <Suspense fallback={<LoadingSpinner />}>
                <FeaturedToolsSection />
                <AboutSection />
                <ContactSection />
            </Suspense>
        </div>
    );
};

export default HomePage;
