import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { checkAiServiceAvailability } from '../services/geminiService';

interface ApiStatusContextType {
    isAiAvailable: boolean;
    apiKeyError: string | null;
}

const ApiStatusContext = createContext<ApiStatusContextType | undefined>(undefined);

export const ApiStatusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [status, setStatus] = useState<ApiStatusContextType>({ isAiAvailable: true, apiKeyError: null });

    useEffect(() => {
        // Check AI service status on initial load.
        const { isAvailable, errorMessage } = checkAiServiceAvailability();
        setStatus({ isAiAvailable: isAvailable, apiKeyError: errorMessage });
    }, []);

    return (
        <ApiStatusContext.Provider value={status}>
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