"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { clearSignInError, signIn } from "@/store/auth/authSlice";
import { useRouter } from "next/navigation";

export default function Login() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const {
        isSignInLoading,
        signInError,
        isSignInSuccess,
        isAuthenticated,
        isHydrated,
        user,
    } = useSelector((state: RootState) => state.auth);
    
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "admin",
    });
    const [showPassword, setShowPassword] = useState(false);

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

    const handleBack = () => {
        dispatch(clearSignInError());
        router.push("/login");
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
        if (isSignInSuccess) {
            // Only redirect if user is actually authenticated
            if (isAuthenticated && user?.role === "admin") {
                router.push("/admin/dashboard");
            }
        }
    }, [isSignInSuccess, isAuthenticated, user, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 ">
            <div className="bg-white w-2xl flex items-center justify-center p-6 sm:p-8 lg:p-12 mt-3 md:mt-0 border-2 border-gray-200 shadow-lg rounded-[12px] mx-5">
                <div className="w-full max-w-md space-y-8">
                    <button
                        onClick={handleBack}
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors group"
                    >
                        <svg
                            className="w-6 h-6 transition-transform group-hover:-translate-x-1"
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

                    </button>

                    <div className="text-center sm:text-left">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 mt-10 md:mt-0">
                            Admin Login
                        </h2>

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
                                placeholder="admin@gmail.com"
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

                        {(signInError) && (
                            <div className="text-red-500 text-sm mb-4 ml-1">
                                {signInError}
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


                    </form>


                </div>
            </div>
        </div>
    );
}
