"use client";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Login() {
    const { user, googleSignIn, emailSignUp, emailSignIn, resetPassword, logOut } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [step, setStep] = useState<"email" | "password" | "otp">("email");
    const [loading, setLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn();
        } catch (error: any) {
            console.error("Login Error:", error);
            alert(error.message);
        }
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setStep("password");
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);
        try {
            await emailSignIn(email, password);
        } catch (err: any) {
            if (
                err.code === "auth/user-not-found" ||
                err.code === "auth/invalid-credential" ||
                err.code === "auth/invalid-login-credentials"
            ) {
                // User not found, switch to OTP step for registration
                setMessage("User not found. We sent an OTP to your email to verify registration.");
                setStep("otp");
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (otp !== "1111") {
            setError("Invalid OTP. Please try again.");
            setLoading(false);
            return;
        }

        try {
            await emailSignUp(email, password);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        setError("");
        setMessage("");
        if (!email) {
            setError("Please enter your email first.");
            setStep("email");
            return;
        }
        try {
            await resetPassword(email);
            setMessage("Password reset email sent! Check your inbox.");
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleSignOut = async () => {
        try {
            await logOut();
            setStep("email");
            setEmail("");
            setPassword("");
            setOtp("");
            setMessage("");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
            <div className="p-10 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 max-w-md w-full text-center transform transition-all hover:scale-105 duration-500">
                <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                    {user ? "Welcome Back" : step === "otp" ? "Verify Email" : step === "password" ? "Enter Password" : "Welcome"}
                </h1>
                <p className="text-gray-300 mb-8">
                    {user
                        ? `Hello, ${user.displayName || user.email}`
                        : step === "email"
                            ? "Enter your email to continue"
                            : step === "otp"
                                ? "Enter the 4-digit OTP sent to your email"
                                : "Enter your password to sign in"}
                </p>

                {user ? (
                    <div className="flex flex-col items-center gap-4">
                        {user.photoURL && (
                            <img
                                src={user.photoURL}
                                alt="Profile"
                                className="w-20 h-20 rounded-full border-4 border-purple-500 shadow-lg"
                            />
                        )}
                        <p className="text-sm text-gray-400">{user.email}</p>
                        <button
                            onClick={handleSignOut}
                            className="w-full py-3 px-6 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-all shadow-lg hover:shadow-red-500/30"
                        >
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {step === "email" ? (
                            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
                                    required
                                    autoFocus
                                />
                                {error && <p className="text-red-400 text-sm">{error}</p>}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-50"
                                >
                                    Continue
                                </button>
                            </form>
                        ) : step === "password" ? (
                            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
                                <div className="text-left">
                                    <button
                                        type="button"
                                        onClick={() => setStep("email")}
                                        className="text-sm text-blue-400 hover:text-blue-300 mb-2 flex items-center gap-1"
                                    >
                                        ← {email}
                                    </button>
                                </div>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
                                    required
                                    autoFocus
                                />
                                {error && <p className="text-red-400 text-sm">{error}</p>}
                                {message && <p className="text-green-400 text-sm">{message}</p>}

                                <div className="text-right">
                                    <button
                                        type="button"
                                        onClick={handleForgotPassword}
                                        className="text-xs text-gray-400 hover:text-white transition-colors"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-50"
                                >
                                    {loading ? "Processing..." : "Continue"}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
                                <div className="text-left">
                                    <button
                                        type="button"
                                        onClick={() => setStep("password")}
                                        className="text-sm text-blue-400 hover:text-blue-300 mb-2 flex items-center gap-1"
                                    >
                                        ← Back
                                    </button>
                                </div>
                                <p className="text-sm text-gray-300">
                                    We sent a code to {email}. Enter it below to create your account.
                                </p>
                                <input
                                    type="text"
                                    placeholder="OTP Code (1111)"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors text-center tracking-widest text-xl"
                                    required
                                    autoFocus
                                    maxLength={4}
                                />
                                {error && <p className="text-red-400 text-sm">{error}</p>}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold transition-all shadow-lg hover:shadow-green-500/30 disabled:opacity-50"
                                >
                                    {loading ? "Verifying..." : "Verify & Create Account"}
                                </button>
                            </form>
                        )}

                        <div className="relative my-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-transparent text-gray-400 bg-gray-900/50">Or continue with</span>
                            </div>
                        </div>

                        <button
                            onClick={handleGoogleSignIn}
                            className="w-full py-3 px-6 rounded-xl bg-white text-gray-900 font-bold flex items-center justify-center gap-3 hover:bg-gray-100 transition-all shadow-lg hover:shadow-white/20 group"
                        >
                            <svg
                                className="w-6 h-6"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3275 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.50253 14.3003C5.00236 12.8099 5.00236 11.1961 5.50253 9.70575V6.61481H1.51649C-0.18551 10.0056 -0.18551 14.0004 1.51649 17.3912L5.50253 14.3003Z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45064 6.86173 9.10947 4.74966 12.2401 4.74966Z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Continue with Google
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
