import React, { useState, useEffect } from 'react';
import { useApiStatus } from '../contexts/ApiStatusContext';
import { XIcon } from './icons';

const SESSION_STORAGE_KEY = 'apiKeyBannerDismissed';

const ApiKeyErrorBanner: React.FC = () => {
    const { isApiKeyMissing, errorMessage } = useApiStatus();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isApiKeyMissing) {
            const dismissed = sessionStorage.getItem(SESSION_STORAGE_KEY);
            if (!dismissed) {
                setIsVisible(true);
            }
        } else {
            setIsVisible(false);
        }
    }, [isApiKeyMissing]);

    const handleDismiss = () => {
        sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="relative bg-red-100 border-l-4 border-red-500 text-red-700 p-4 dark:bg-red-900/50 dark:text-red-300 dark:border-red-600" role="alert">
            <button
                onClick={handleDismiss}
                className="absolute top-2 right-2 p-1 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 rounded-full transition-colors"
                aria-label="Dismiss"
            >
                <XIcon className="w-5 h-5" />
            </button>
            <p className="font-bold">Configuration Error</p>
            <p className="whitespace-pre-wrap pr-6">{errorMessage}</p>
        </div>
    );
};

export default ApiKeyErrorBanner;
