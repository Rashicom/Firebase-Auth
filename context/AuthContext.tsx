"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    User,
} from "firebase/auth";
import { auth } from "../lib/firebase";

interface AuthContextType {
    user: User | null;
    googleSignIn: () => Promise<void>;
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

    const logOut = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, googleSignIn, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};
