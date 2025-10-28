import React, { lazy, Suspense } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const SunIcon = lazy(() => import('./icons').then(module => ({ default: module.SunIcon })));
const MoonIcon = lazy(() => import('./icons').then(module => ({ default: module.MoonIcon })));

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-secondary hover:text-primary dark:text-slate-400 dark:hover:text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
            aria-label="Toggle theme"
        >
            <Suspense fallback={<div>...</div>}>
                {theme === 'light' ? (
                    <MoonIcon className="w-6 h-6" />
                ) : (
                    <SunIcon className="w-6 h-6" />
                )}
            </Suspense>
        </button>
    );
};

export default ThemeToggle;
