import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, updatePassword, User } from 'firebase/auth';


interface AuthUser {
    uid: string;
    email: string | null;
}

interface AuthContextType {
    user: AuthUser | null;
    isAdmin: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    changePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth) {
            setLoading(false);
            return;
        }
        
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
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

    const changePassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
        if (!auth || !auth.currentUser) {
            return { success: false, error: 'No user is logged in.' };
        }
        try {
            await updatePassword(auth.currentUser, newPassword);
            return { success: true };
        } catch (error: any) {
            console.error("Firebase change password error:", error);
            let errorMessage = 'Failed to change password. Please try again.';
            if (error.code === 'auth/weak-password') {
                errorMessage = 'The new password is too weak. It must be at least 6 characters long.';
            } else if (error.code === 'auth/requires-recent-login') {
                errorMessage = 'This action is sensitive and requires recent authentication. Please log out and log back in before changing your password.';
            }
            return { success: false, error: errorMessage };
        }
    };
    
    // In a real app, you might have more complex logic for what defines an "admin".
    // For now, any logged-in user is considered an admin.
    const isAdmin = !!user;

    return (
        <AuthContext.Provider value={{ user, isAdmin, loading, login, logout, changePassword }}>
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