import React from 'react';
import { Link } from 'react-router-dom';
import { CodeIcon } from './icons';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

const Footer: React.FC = () => {
    const { settings } = useSiteSettings();
    const socialLinks = settings.socialLinks;

    return (
        <footer className="bg-dark text-white dark:border-t dark:border-slate-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div className="flex items-center space-x-2 justify-center md:justify-start">
                        <CodeIcon className="w-7 h-7 text-primary"/>
                        <span className="text-xl font-bold">SolverHub</span>
                    </div>
                    
                    <div className="text-sm text-gray-400 flex flex-col items-center space-y-2">
                         <p>&copy; {new Date().getFullYear()} SolverHub. All rights reserved.</p>
                         <div className="flex space-x-4">
                            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                            <Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
                         </div>
                    </div>

                    <div className="flex flex-col items-center md:items-end space-y-2">
                        <div className="flex items-center space-x-6">
                            {Object.entries(socialLinks).filter(([, link]) => link && link.trim() !== '' && link.trim() !== '#').map(([name, link]) => (
                                <a key={name} href={link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                                    <span className="capitalize">{name}</span>
                                </a>
                            ))}
                        </div>
                         <Link to="/login" className="text-sm text-gray-500 hover:text-primary transition-colors">Admin</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;