import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface AuthContextType {
    isAdmin: boolean;
    login: (password: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_PASSWORD = "admin"; // In a real app, this would be handled by a secure backend.
const LOCAL_STORAGE_KEY = 'isAdmin';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState<boolean>(() => {
        return localStorage.getItem(LOCAL_STORAGE_KEY) === 'true';
    });

    const login = (password: string): boolean => {
        if (password === ADMIN_PASSWORD) {
            localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
            setIsAdmin(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
