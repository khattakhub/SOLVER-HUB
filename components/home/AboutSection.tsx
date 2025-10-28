import React from 'react';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';

const AboutSection: React.FC = () => {
    const { settings } = useSiteSettings();

    return (
        <section className="bg-white dark:bg-dark py-16 sm:py-20 transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-dark dark:text-light">{settings.aboutTitle}</h2>
                    <p className="mt-4 text-lg text-secondary dark:text-slate-400 whitespace-pre-wrap">
                        {settings.aboutContent}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
