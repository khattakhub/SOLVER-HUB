import React from 'react';
import { Link } from 'react-router-dom';
import { SOCIAL_LINKS } from '../constants';
import { CodeIcon } from './icons';

const Footer: React.FC = () => {
    return (
        <footer className="bg-dark text-white dark:border-t dark:border-slate-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-2">
                        <CodeIcon className="w-7 h-7 text-primary"/>
                        <span className="text-xl font-bold">SolverHub</span>
                    </div>
                    <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} SolverHub. All rights reserved.</p>
                    <div className="flex items-center space-x-6">
                        <div className="flex space-x-4">
                            {Object.entries(SOCIAL_LINKS).map(([name, link]) => (
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