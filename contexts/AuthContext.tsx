import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User as FirebaseUser } from 'firebase/auth';

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
        if (!auth) {
            console.error("Firebase auth is not initialized");
            setLoading(false);
            return;
        };
        
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
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
            await signInWithEmailAndPassword(auth, email, password);
            return true;
        } catch (error) {
            console.error("Firebase login error:", error);
            return false;
        }
    };

    const logout = async (): Promise<void> => {
        if (!auth) return;
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Firebase logout error:", error);
        }
    };
    
    const isAdmin = !!user;

    return (
        <AuthContext.Provider value={{ user, isAdmin, loading, login, logout }}>
            {!loading ? children : null}
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
