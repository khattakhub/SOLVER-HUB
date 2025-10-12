import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { auth } from '../services/firebase';
// FIX: The project appears to be using Firebase v8 SDK with a v9+ package.
// The imports have been changed to use the v8 compatibility layer to resolve types.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';


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
    changePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth) {
            setLoading(false);
            return;
        }
        // FIX: Switched from v9 `onAuthStateChanged(auth, ...)` to v8 `auth.onAuthStateChanged(...)` and updated User type.
        const unsubscribe = auth.onAuthStateChanged((firebaseUser: firebase.User | null) => {
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
            // FIX: Switched from v9 `signInWithEmailAndPassword(auth, ...)` to v8 `auth.signInWithEmailAndPassword(...)`
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
            // FIX: Switched from v9 `signOut(auth)` to v8 `auth.signOut()`
            await auth.signOut();
        } catch (error) {
            console.error("Firebase logout error:", error);
        }
    };

    const changePassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
        if (!auth || !auth.currentUser) {
            return { success: false, error: 'No user is logged in.' };
        }
        try {
            // FIX: Switched from v9 `updatePassword(auth.currentUser, ...)` to v8 `auth.currentUser.updatePassword(...)`
            await auth.currentUser.updatePassword(newPassword);
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