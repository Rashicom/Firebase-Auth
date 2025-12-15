"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    fetchSignInMethodsForEmail,
    signOut,
    User,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { error } from "console";

interface AuthContextType {
    user: User | null;
    googleSignIn: () => Promise<void>;
    emailSignUp: (email: string, pass: string) => Promise<void>;
    emailSignIn: (email: string, pass: string) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    checkEmailExists: (email: string) => Promise<boolean>;
    logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | any>({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const googleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    };

    const emailSignUp = async (email: string, pass: string) => {
        await createUserWithEmailAndPassword(auth, email, pass);
    };

    const emailSignIn = async (email: string, pass: string) => {
        await signInWithEmailAndPassword(auth, email, pass);
    };

    const resetPassword = async (email: string) => {
        await sendPasswordResetEmail(auth, email);
    };

    const checkEmailExists = async (email: string) => {
        try {
            const methods = await fetchSignInMethodsForEmail(auth, email);
            return methods.length > 0;
        } catch (error) {
            // If email enumeration protection is on, this might return empty or error.
            // For this demo, we assume no error means we can proceed.
            // TODO: email varification with BE
            console.log(error);
            return false;
        }
    };

    const logOut = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, googleSignIn, emailSignUp, emailSignIn, resetPassword, checkEmailExists, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};
