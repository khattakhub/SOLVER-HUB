import React, { useState } from 'react';
import { useApiStatus } from '../contexts/ApiStatusContext';
import { XIcon } from './icons';

const ApiKeyErrorBanner: React.FC = () => {
    const { apiKeyError } = useApiStatus();
    const [isVisible, setIsVisible] = useState(true);

    if (!apiKeyError || !isVisible) {
        return null;
    }

    return (
        <div className="bg-red-100 text-red-800 relative fade-in" role="alert">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-bold text-base">Configuration Error</p>
                        <div className="text-sm whitespace-pre-wrap">{apiKeyError}</div>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-1.5 ml-4"
                        aria-label="Dismiss"
                    >
                        <XIcon className="w-5 h-5 text-red-600 hover:text-red-800" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApiKeyErrorBanner;
