"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store";
import { clearSignUpError, googleSignIn, signUp } from "@/store/auth/authSlice";
import { GoogleLogin } from "@react-oauth/google";

export default function SignUp() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const {
        isSignUpLoading,
        signUpError,
        isSignUpSuccess,
        isGoogleSignInLoading,
        googleSignInError,
        isGoogleSignInSuccess,
        isAuthenticated,
        isHydrated,
        user,
    } = useSelector((state: RootState) => state.auth);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        dispatch(clearSignUpError());

        if (formData.password !== formData.confirmPassword) {
            setError("Password and Confirm Password does not match!");
            return;
        }
        const payload = {
            full_name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
        };
        dispatch(signUp(payload));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleBackToHome = () => {
        dispatch(clearSignUpError());
        router.push("/");
    };

    const handleNavigateToLogin = () => {
        dispatch(clearSignUpError());
        router.push("/login");
    };

    // Redirect already-authenticated users away from signup
    useEffect(() => {
        if (isHydrated && isAuthenticated) {
            // Redirect admin to admin dashboard, regular users to user dashboard
            if (user?.role === "admin") {
                router.replace("/admin/dashboard");
            } else {
                router.replace("/dashboard");
            }
        }
    }, [isHydrated, isAuthenticated, user, router]);

    useEffect(() => {
        if (isSignUpSuccess || isGoogleSignInSuccess) {
            // Redirect based on user role
            if (user?.role === "admin") {
                router.push("/admin/dashboard");
            } else {
                router.push("/dashboard");
            }
        }
    }, [isSignUpSuccess, isGoogleSignInSuccess, user]);

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
                            Join
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200 mt-2">
                                CarPrice AI
                            </span>
                        </h1>

                        <p className="text-blue-100 text-base sm:text-[17px] leading-relaxed">
                            Create your account and start predicting car prices
                            with precision. Save your predictions, track market
                            trends, and make smarter buying decisions with our
                            AI-powered platform.
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
                                    Free Forever
                                </h3>
                                <p className="text-blue-200 text-xs mt-0.5">
                                    No credit card required to get started
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
                                    Instant Access
                                </h3>
                                <p className="text-blue-200 text-xs mt-0.5">
                                    Start using AI predictions immediately
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
                                    Secure & Private
                                </h3>
                                <p className="text-blue-200 text-xs mt-0.5">
                                    Your data is encrypted and protected
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Signup Form */}
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

                    <div className="text-center sm:text-left mt-3 md:mt-0">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                            Create your account
                        </h2>
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <button
                                onClick={handleNavigateToLogin}
                                className="font-medium text-blue-600 hover:text-blue-500 transition-colors cursor-pointer"
                            >
                                Sign in
                            </button>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900 placeholder-gray-400"
                                placeholder="John Doe"
                            />
                        </div>

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
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
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
                            <p className="mt-1.5 text-xs text-gray-500">
                                Must be at least 8 characters
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    autoComplete="new-password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900 placeholder-gray-400 pr-12"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword,
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    {showConfirmPassword ? (
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

                        {/* Terms and Conditions Checkbox */}
                        <div className="flex items-start">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                required
                                className="h-4 w-4 mt-0.5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                            />
                            <label
                                htmlFor="terms"
                                className="ml-2 block text-sm text-gray-700 cursor-pointer select-none"
                            >
                                I agree to the{" "}
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
                            </label>
                        </div>

                        {(signUpError || googleSignInError) && (
                            <div className="text-red-500 text-sm mb-4 ml-1">
                                {signUpError || googleSignInError}
                            </div>
                        )}

                        {error && (
                            <div className="text-red-500 text-sm mb-4 ml-1">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSignUpLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                        >
                            {isSignUpLoading ? (
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
                                    Creating Account...
                                </div>
                            ) : (
                                "Create Account"
                            )}
                        </button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">
                                    Or sign up with
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
                </div>
            </div>
        </div>
    );
}
