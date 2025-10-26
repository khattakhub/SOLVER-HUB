import React from 'react';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

const AboutUsPage: React.FC = () => {
    const { settings } = useSiteSettings();

    return (
        <div className="bg-white dark:bg-dark py-12 sm:py-16 transition-colors duration-300 fade-in">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-dark dark:text-light tracking-tight mb-8">About Us</h1>
                    <div className="prose prose-lg dark:prose-invert max-w-none text-secondary dark:text-slate-400 whitespace-pre-wrap">
                        <p>Welcome to {settings.siteName}!</p>
                        <p>We are dedicated to providing you with the best tools and resources to help you with your daily tasks. Our mission is to create a one-stop-shop for all your needs, with a focus on quality, reliability, and user experience.</p>
                        <p>Our team is passionate about technology and innovation, and we are constantly working to improve our services and develop new tools to meet your evolving needs. We believe that everyone should have access to high-quality tools that can help them work smarter, not harder.</p>
                        <p>Thank you for visiting our site. We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;
