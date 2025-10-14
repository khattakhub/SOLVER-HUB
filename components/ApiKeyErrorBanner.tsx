import React from 'react';
import { useApiStatus } from '../contexts/ApiStatusContext';

const ApiKeyErrorBanner: React.FC = () => {
    const { isAiAvailable, apiKeyError } = useApiStatus();

    if (isAiAvailable) {
        return null;
    }

    return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 dark:bg-red-900/50 dark:text-red-300 dark:border-red-600" role="alert">
            <p className="font-bold">AI Service Unavailable</p>
            <p>{apiKeyError || 'An unknown error occurred with the AI service.'}</p>
        </div>
    );
};

export default ApiKeyErrorBanner;