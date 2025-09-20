import React, { createContext, useContext, ReactNode } from 'react';

// This context is part of a legacy global error handling system that has been disabled.
// API key errors are now handled within each individual tool.
// This file is kept to prevent import errors but should not be used.

interface ApiStatusContextType {
    apiKeyError: string | null;
}

const ApiStatusContext = createContext<ApiStatusContextType | undefined>(undefined);

export const ApiStatusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <ApiStatusContext.Provider value={{ apiKeyError: null }}>
            {children}
        </ApiStatusContext.Provider>
    );
};

export const useApiStatus = (): ApiStatusContextType => {
    const context = useContext(ApiStatusContext);
    if (!context) {
        // This should not happen if the provider is used, but it's a safe fallback.
        return { apiKeyError: null };
    }
    return context;
};
