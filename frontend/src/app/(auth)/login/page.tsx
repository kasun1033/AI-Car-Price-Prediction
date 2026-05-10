"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { clearSignInError, googleSignIn, signIn } from "@/store/auth/authSlice";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const {
        isSignInLoading,
        signInError,
        isSignInSuccess,
        isGoogleSignInLoading,
        googleSignInError,
        isGoogleSignInSuccess,
        isAuthenticated,
        isHydrated,
        user,
    } = useSelector((state: RootState) => state.auth);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "user",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(clearSignInError());
        dispatch(signIn(formData));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleBackToHome = () => {
        dispatch(clearSignInError());
        router.push("/");
    };

    const handleNavigateToSignUp = () => {
        dispatch(clearSignInError());
        router.push("/signup");
    };

    // Redirect already-authenticated users away from login
    useEffect(() => {
        if (isHydrated && isAuthenticated) {
            if (user?.role === "admin") {
                router.replace("/admin/dashboard");
            } else {
                router.replace("/dashboard");
            }
        }
    }, [isHydrated, isAuthenticated, user, router]);

    useEffect(() => {
        if (isSignInSuccess || isGoogleSignInSuccess) {
            // Only redirect if user is actually authenticated
            if (isAuthenticated && user) {
                // Redirect based on user role
                if (user?.role === "admin") {
                    router.push("/admin/dashboard");
                } else {
                    router.push("/dashboard");
                }
            }
        }
    }, [isSignInSuccess, isGoogleSignInSuccess, isAuthenticated, user, router]);

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left Side - Welcome Section */}
            <div className="hidden md:flex bg-gradient-to-br from-blue-800 via-blue-900 to-indigo-900 w-full md:w-2/5 items-center justify-center p-8 sm:p-12 lg:p-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

                <div className="relative z-10 max-w-md text-white space-y-6">
                    <div className="space-y-4">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-sm">
                            <span className="text-xs font-medium">
                                🚗 AI-Powered Platform
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-[45px] font-bold tracking-tight leading-tight">
                            Welcome Back to
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200 mt-2">
                                CarPrice AI
                            </span>
                        </h1>

                        <p className="text-blue-100 text-base sm:text-[17px] leading-relaxed">
                            Login and access your personalized car price
                            predictions. Keep your search history, saved
                            predictions, and preferences securely stored in one
                            place.
                        </p>
                    </div>

                    <div className="pt-6 space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/30 flex items-center justify-center mt-0.5">
                                <svg
                                    className="w-4 h-4 text-blue-200"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">
                                    Accurate Predictions
                                </h3>
                                <p className="text-blue-200 text-xs mt-0.5">
                                    Get ML-powered car price estimates
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/30 flex items-center justify-center mt-0.5">
                                <svg
                                    className="w-4 h-4 text-blue-200"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">
                                    Save Your Data
                                </h3>
                                <p className="text-blue-200 text-xs mt-0.5">
                                    Access your predictions anytime, anywhere
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/30 flex items-center justify-center mt-0.5">
                                <svg
                                    className="w-4 h-4 text-blue-200"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">
                                    Personalized Experience
                                </h3>
                                <p className="text-blue-200 text-xs mt-0.5">
                                    Customized recommendations just for you
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="bg-white w-full md:w-3/5 flex items-center justify-center p-6 sm:p-8 lg:p-12 mt-3 md:mt-0">
                <div className="w-full max-w-md space-y-8">
                    <button
                        onClick={handleBackToHome}
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors group"
                    >
                        <svg
                            className="w-5 h-5 transition-transform group-hover:-translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Back to Home
                    </button>

                    <div className="text-center sm:text-left">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 mt-10 md:mt-0">
                            Sign in to your account
                        </h2>
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <button
                                onClick={handleNavigateToSignUp}
                                className="font-medium text-blue-600 hover:text-blue-500 transition-colors cursor-pointer"
                            >
                                Sign up for free
                            </button>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900 placeholder-gray-400"
                                placeholder="you@gmail.com"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900 placeholder-gray-400 pr-12"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {(signInError || googleSignInError) && (
                            <div className="text-red-500 text-sm mb-4 ml-1">
                                {signInError || googleSignInError}
                            </div>
                        )}

                        {error && (
                            <div className="text-red-500 text-sm mb-4 ml-1">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSignInLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] cursor-pointer"
                        >
                            {isSignInLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg
                                        className="w-5 h-5 mr-2 animate-spin"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        />
                                    </svg>
                                    Signing in...
                                </div>
                            ) : (
                                "Sign in"
                            )}
                        </button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        {isGoogleSignInLoading ? (
                            <div className="flex items-center justify-center w-full">
                                <div className="flex items-center gap-3 px-7 py-3.5 rounded-full border border-gray-200 bg-white shadow-md animate-pulse-subtle">
                                    {/* Google multicolor spinner */}
                                    <svg
                                        className="w-6 h-6 animate-spin"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="#E8EAED"
                                            strokeWidth="3"
                                        />
                                        <path
                                            d="M12 2a10 10 0 0 1 10 10"
                                            stroke="#4285F4"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M22 12a10 10 0 0 1-5 8.66"
                                            stroke="#34A853"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M17 20.66A10 10 0 0 1 2 12"
                                            stroke="#FBBC05"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M2 12A10 10 0 0 1 12 2"
                                            stroke="#EA4335"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <span className="text-base font-medium text-gray-600 tracking-wide">
                                        Signing in with Google…
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <GoogleLogin
                                onSuccess={(credentialResponse) => {
                                    if (credentialResponse.credential) {
                                        dispatch(
                                            googleSignIn({
                                                id_token:
                                                    credentialResponse.credential,
                                            }),
                                        );
                                    }
                                }}
                                onError={() => {
                                    setError("Google Sign In Failed");
                                }}
                            />
                        )}
                    </form>

                    <p className="text-xs text-center text-gray-500 mt-6">
                        By signing in, you agree to our{" "}
                        <Link
                            href="/terms"
                            className="text-blue-600 hover:text-blue-500"
                        >
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                            href="/privacy"
                            className="text-blue-600 hover:text-blue-500"
                        >
                            Privacy Policy
                        </Link>
                    </p>

                    <div className="mt-6 text-center">
                        <Link
                            href="/admin/login"
                            className="inline-flex items-center justify-center gap-2 w-1/2 px-4 py-3 rounded-lg bg-gray-700 via-gray-900 to-slate-900 text-white font-medium text-sm hover:from-gray-700 hover:via-gray-800 hover:to-slate-800 transition-all duration-200 shadow-md hover:shadow-lg border border-gray-700/50"
                        >
                            <svg
                                className="w-5 h-5 text-white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.83-3.13 9.37-7 10.5-3.87-1.13-7-5.67-7-10.5V6.3l7-3.12z" />
                            </svg>
                            Login as Admin
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
