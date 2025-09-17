import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface ApiStatusContextType {
    isApiKeyMissing: boolean;
    errorMessage: string | null;
}

const ApiStatusContext = createContext<ApiStatusContextType | undefined>(undefined);

const API_KEY_ERROR_MESSAGE = `AI features are disabled. The application requires a Google Gemini API Key to function.

Please ensure the 'API_KEY' environment variable is set in your deployment environment.

For example, if deploying on Vercel:
1. Go to your Project Settings.
2. Navigate to 'Environment Variables'.
3. Add a variable named 'API_KEY' with your key as the value.
4. Redeploy your application.`;

export const ApiStatusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!process.env.API_KEY) {
            setIsApiKeyMissing(true);
            setErrorMessage(API_KEY_ERROR_MESSAGE);
        }
    }, []);

    return (
        <ApiStatusContext.Provider value={{ isApiKeyMissing, errorMessage }}>
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
