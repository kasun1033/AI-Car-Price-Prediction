"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
    Menu,
    X,
    LayoutDashboard,
    LogIn,
    UserPlus,
    User,
    LogOut,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { logout } from "@/store/auth/authSlice";
import DeleteAccountModal from "./DeleteAccountModal";

const getInitials = (fullName: string | null | undefined): string => {
    if (!fullName) return "?";
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

interface ProfileAvatarProps {
    profilePicture: string | null | undefined;
    fullName: string | null | undefined;
    size?: "sm" | "md";
}

const ProfileAvatar = ({
    profilePicture,
    fullName,
    size = "md",
}: ProfileAvatarProps) => {
    const dim = size === "sm" ? "w-8 h-8 text-xs" : "w-9.5 h-9.5 text-sm";

    if (profilePicture) {
        return (
            <div
                className={`${dim} relative rounded-full overflow-hidden ring-2 ring-blue-900/30 hover:ring-blue-900 transition-all duration-200 shadow-md flex-shrink-0`}
            >
                <Image
                    src={profilePicture}
                    alt={fullName ?? "Profile"}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                />
            </div>
        );
    }

    return (
        <div
            className={`${dim} flex items-center justify-center rounded-full bg-gradient-to-br from-blue-700 to-blue-900 text-white font-semibold select-none ring-2 ring-blue-900/30 hover:ring-blue-900 transition-all duration-200 shadow-md flex-shrink-0`}
        >
            {getInitials(fullName)}
        </div>
    );
};

export const Navbar = () => {
    const dispatch = useDispatch();
    const pathname = usePathname();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    const { isAuthenticated, accessToken, user } = useSelector(
        (state: RootState) => state.auth,
    );
    const logged = isAuthenticated && accessToken;
    const isAdmin = user?.role === "admin";

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(e.target as Node)
            ) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMenuOpen]);

    const handleLogout = () => {
        dispatch(logout());
        setIsProfileOpen(false);
        setIsMenuOpen(false);
    };

    return (
        <>
            <nav className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0">
                            <Link
                                href="/"
                                className="text-[22px] font-semibold bg-gradient-to-r from-blue-900 to-blue-950 bg-clip-text text-transparent hover:from-black hover:to-black transition-all duration-300"
                            >
                                Car Price Predictor
                            </Link>
                        </div>

                        {/* Desktop nav */}
                        {logged ? (
                            <div className="hidden md:flex items-center space-x-4">
                                {isAdmin && (
                                    <Link
                                        href="/admin/dashboard"
                                        className={`px-3 py-2 font-medium rounded-lg transform transition-all duration-200 shadow-md hover:shadow-lg ${
                                            pathname.startsWith("/admin")
                                                ? "bg-blue-900 text-white shadow-lg ring-2 ring-blue-400/30"
                                                : "text-gray-700 hover:text-white hover:bg-blue-900"
                                        }`}
                                    >
                                        Admin Dashboard
                                    </Link>
                                )}

                                <Link
                                    href="/dashboard"
                                    className={`px-3 py-2 font-medium rounded-lg transform transition-all duration-200 shadow-md hover:shadow-lg ${
                                        pathname === "/dashboard"
                                            ? "bg-blue-900 text-white shadow-lg ring-2 ring-blue-400/30"
                                            : "text-gray-700 hover:text-white hover:bg-blue-900"
                                    }`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/predict"
                                    className={`px-6 py-2 font-medium rounded-lg transform transition-all duration-200 shadow-md hover:shadow-lg ${
                                        pathname === "/predict"
                                            ? "bg-blue-900 text-white shadow-lg ring-2 ring-blue-400/30"
                                            : "text-blue-900 hover:text-white hover:bg-blue-900"
                                    }`}
                                >
                                    Predict
                                </Link>

                                <div className="relative ml-2" ref={profileRef}>
                                    <button
                                        onClick={() =>
                                            setIsProfileOpen((prev) => !prev)
                                        }
                                        title={user?.full_name ?? "Profile"}
                                        className="focus:outline-none"
                                    >
                                        <ProfileAvatar
                                            profilePicture={
                                                user?.profile_picture
                                            }
                                            fullName={user?.full_name}
                                        />
                                    </button>

                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                                            <button
                                                onClick={() => {
                                                    setIsProfileOpen(false);
                                                    setDeleteAccountModalOpen(
                                                        true,
                                                    );
                                                }}
                                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                            >
                                                <User className="w-4 h-4 text-red-600" />
                                                Delete Account
                                            </button>
                                            <div className="border-t border-gray-100 my-1" />
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4 text-red-500" />
                                                Log out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center space-x-4">
                                <Link
                                    href="/login"
                                    className={`px-6 py-2 font-medium transition-colors duration-200 cursor-pointer ${
                                        pathname === "/login"
                                            ? "text-blue-900 border-b-2 border-blue-900"
                                            : "text-gray-700 hover:text-blue-900"
                                    }`}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className={`px-6 py-2 text-white font-medium rounded-lg transform transition-all duration-200 shadow-md hover:shadow-lg ${
                                        pathname === "/signup"
                                            ? "bg-blue-950 ring-2 ring-blue-400/30 shadow-lg"
                                            : "bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-950 hover:to-blue-950"
                                    }`}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        <div className="md:hidden">
                            <button
                                onClick={toggleMenu}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200 z-50 relative"
                                aria-expanded={isMenuOpen}
                            >
                                <span className="sr-only">Open main menu</span>
                                {!isMenuOpen ? (
                                    <Menu className="h-6 w-6" />
                                ) : (
                                    <X className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div
                className={`fixed inset-0 bg-black/10 backdrop-blur-[2px] z-40 md:hidden transition-opacity duration-300 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
                onClick={() => setIsMenuOpen(false)}
            />

            <div
                className={`fixed top-0 right-0 h-full w-72 bg-blue-950 shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-6 border-b border-blue-700/30">
                        {logged ? (
                            <div className="flex items-center gap-3">
                                <ProfileAvatar
                                    profilePicture={user?.profile_picture}
                                    fullName={user?.full_name}
                                    size="sm"
                                />
                                <div className="flex flex-col leading-tight">
                                    <span className="text-white text-sm font-medium truncate max-w-[140px]">
                                        {user?.full_name ?? "Welcome"}
                                    </span>
                                    <span className="text-blue-300 text-xs truncate max-w-[140px]">
                                        {user?.email ?? ""}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <span className="text-white font-semibold text-base">
                                Menu
                            </span>
                        )}
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Mobile nav links */}
                    <div className="flex-1 px-6 py-8 overflow-y-auto">
                        {logged ? (
                            <div className="space-y-3">
                                {isAdmin && (
                                    <Link
                                        href="/admin/dashboard"
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white transition-all duration-200 group ${
                                            pathname.startsWith("/admin")
                                                ? "bg-white/15 border border-blue-400/30"
                                                : "hover:bg-white/10"
                                        }`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <LayoutDashboard className={`w-5 h-5 transition-colors ${
                                            pathname.startsWith("/admin")
                                                ? "text-white"
                                                : "text-blue-200 group-hover:text-white"
                                        }`} />
                                        <span className="font-normal">
                                            Admin Dashboard
                                        </span>
                                    </Link>
                                )}

                                <Link
                                    href="/dashboard"
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white transition-all duration-200 group ${
                                        pathname === "/dashboard"
                                            ? "bg-white/15 border border-blue-400/30"
                                            : "hover:bg-white/10"
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <LayoutDashboard className={`w-5 h-5 transition-colors ${
                                        pathname === "/dashboard"
                                            ? "text-white"
                                            : "text-blue-200 group-hover:text-white"
                                    }`} />
                                    <span className="font-normal">
                                        Dashboard
                                    </span>
                                </Link>

                                <Link
                                    href="/predict"
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white border border-blue-400/30 transition-all duration-200 ${
                                        pathname === "/predict"
                                            ? "bg-white/15"
                                            : "hover:bg-white/10"
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <span className="font-normal">Predict</span>
                                </Link>

                                {/* Separate profile link in mobile nav */}
                                <Link
                                    href="/profile"
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white transition-all duration-200 group ${
                                        pathname === "/profile"
                                            ? "bg-white/15 border border-blue-400/30"
                                            : "hover:bg-white/10"
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <User className={`w-5 h-5 transition-colors ${
                                        pathname === "/profile"
                                            ? "text-white"
                                            : "text-blue-200 group-hover:text-white"
                                    }`} />
                                    <span className="font-normal">
                                        My Profile
                                    </span>
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white text-blue-900 hover:bg-blue-50 transition-all duration-200 font-normal shadow-lg"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Log out
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <Link
                                    href="/login"
                                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white border border-blue-400/30 transition-all duration-200 font-normal ${
                                        pathname === "/login"
                                            ? "bg-white/15"
                                            : "hover:bg-white/10"
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <LogIn className="w-5 h-5" />
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 font-normal shadow-lg ${
                                        pathname === "/signup"
                                            ? "bg-blue-100 text-blue-900 ring-2 ring-blue-400/30"
                                            : "bg-white text-blue-900 hover:bg-blue-50"
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <UserPlus className="w-5 h-5" />
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <DeleteAccountModal
                isOpen={deleteAccountModalOpen}
                onClose={() => setDeleteAccountModalOpen(false)}
            />
        </>
    );
};

export default Navbar;
