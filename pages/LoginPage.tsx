import React, { useState } from 'react';
// FIX: Corrected import for react-router-dom components.
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CodeIcon } from '../components/icons';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const success = await login(email, password);
        if (success) {
            navigate('/admin');
        } else {
            setError('Incorrect email or password. Please try again.');
        }
        setIsLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-light dark:bg-dark transition-colors duration-300 fade-in">
            <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border dark:border-slate-700">
                <div className="text-center">
                    <div className="inline-flex justify-center">
                        <CodeIcon className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="mt-4 text-3xl font-extrabold text-center text-dark dark:text-light">
                        Admin Login
                    </h2>
                    <p className="mt-2 text-center text-sm text-secondary dark:text-slate-400">
                        Enter credentials to access the dashboard.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm dark:bg-slate-900 dark:border-slate-600 dark:text-light dark:placeholder-slate-400"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password-input" className="sr-only">Password</label>
                            <input
                                id="password-input"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm dark:bg-slate-900 dark:border-slate-600 dark:text-light dark:placeholder-slate-400"
                                placeholder="Password"
                            />
                        </div>
                    </div>
                    
                    {error && <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition-colors disabled:bg-gray-400"
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;