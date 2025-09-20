import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
// FIX: Per services/geminiService.ts, API key errors are handled within each tool, not via a global banner. This context is disabled.
// import { getApiKeyError } from '../services/geminiService';

interface ApiStatusContextType {
    apiKeyError: string | null;
}

const ApiStatusContext = createContext<ApiStatusContextType | undefined>(undefined);

export const ApiStatusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [apiKeyError, setApiKeyError] = useState<string | null>(null);

    useEffect(() => {
        // const error = getApiKeyError();
        // if (error) {
        //     setApiKeyError(error.message);
        // }
    }, []);

    const value = { apiKeyError };

    return (
        <ApiStatusContext.Provider value={value}>
            {children}
        </ApiStatusContext.Provider>
    );
};

export const useApiStatus = (): ApiStatusContextType => {
    const context = useContext(ApiStatusContext);
    if (!context) {
        throw new Error('useApiStatus must be used within an ApiStatusProvider');
    }
    return context;
};