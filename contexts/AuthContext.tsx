import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { auth } from '../services/firebase';

interface User {
    uid: string;
    email: string | null;
}

interface AuthContextType {
    user: User | null;
    isAdmin: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth?.onAuthStateChanged(firebaseUser => {
            if (firebaseUser) {
                setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        if (!auth) return false;
        try {
            await auth.signInWithEmailAndPassword(email, password);
            return true;
        } catch (error) {
            console.error("Firebase login error:", error);
            return false;
        }
    };

    const logout = async (): Promise<void> => {
        if (!auth) return;
        try {
            await auth.signOut();
        } catch (error) {
            console.error("Firebase logout error:", error);
        }
    };
    
    // In a real app, you might have more complex logic for what defines an "admin".
    // For now, any logged-in user is considered an admin.
    const isAdmin = !!user;

    return (
        <AuthContext.Provider value={{ user, isAdmin, loading, login, logout }}>
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