import React, { useState, useEffect, lazy, Suspense } from 'react';
// FIX: Corrected import for react-router-dom components.
import { Link, NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import ThemeToggle from './ThemeToggle';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

const MenuIcon = lazy(() => import('./icons').then(module => ({ default: module.MenuIcon })));
const XIcon = lazy(() => import('./icons').then(module => ({ default: module.XIcon })));
const CodeIcon = lazy(() => import('./icons').then(module => ({ default: module.CodeIcon })));

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { settings } = useSiteSettings();

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5073136318802367";
        script.crossOrigin = "anonymous";
        script.async = true;
        document.head.appendChild(script);
    }, []);

    return (
        <header className="bg-white shadow-md sticky top-0 z-50 dark:bg-dark dark:border-b dark:border-slate-800 transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-dark dark:text-light">
                        <Suspense fallback={<div>...</div>}>
                            <CodeIcon className="w-8 h-8 text-primary"/>
                        </Suspense>
                       <span>{settings.siteName}</span>
                    </Link>
                    <div className="flex items-center">
                        <nav className="hidden md:flex space-x-8">
                            {NAV_LINKS.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `text-base font-medium transition-colors duration-200 ${
                                            isActive ? 'text-primary' : 'text-secondary dark:text-slate-400 hover:text-primary dark:hover:text-primary'
                                        }`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                        </nav>
                        <div className="hidden md:block ml-6">
                           <ThemeToggle />
                        </div>
                        <div className="md:hidden ml-4">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-secondary dark:text-slate-400 hover:text-primary dark:hover:text-primary">
                                <Suspense fallback={<div>...</div>}>
                                    {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                                </Suspense>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white dark:bg-dark border-t dark:border-slate-800">
                    <nav className="flex flex-col p-4 space-y-2">
                        {NAV_LINKS.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={({ isActive }) =>
                                    `text-base font-medium py-2 px-4 rounded-md transition-colors duration-200 ${
                                        isActive ? 'bg-sky-100 dark:bg-slate-800 text-primary' : 'text-secondary dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                                    }`
                                 }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                         <div className="border-t dark:border-slate-800 pt-4 mt-2 flex justify-end">
                            <ThemeToggle />
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;