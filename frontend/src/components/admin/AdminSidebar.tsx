"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, MessageSquare, LogOut, Home, Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { logout } from "@/store/auth/authSlice";
import { useState, useEffect } from "react";

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Close sidebar on ESC key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Prevent body scroll when mobile sidebar is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const handleLogout = () => {
        dispatch(logout());
        router.push("/admin/login");
    };

    const menuItems = [
        {
            name: "Dashboard",
            path: "/admin/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "User Management",
            path: "/admin/users",
            icon: Users,
        },
        {
            name: "Feedbacks",
            path: "/admin/feedbacks",
            icon: MessageSquare,
        },
    ];

    const SidebarContent = () => (
        <div className="h-full flex flex-col bg-blue-950">
            <div className="py-6 px-8 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white">ADMIN</h2>
                    <p className="text-sm text-gray-300 mt-1 truncate max-w-[160px]">{user?.email}</p>
                </div>
                <button
                    className="md:hidden text-gray-300 hover:text-white transition-colors p-1 rounded-lg hover:bg-blue-800"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close sidebar"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <nav className="flex-1 p-4 mt-2">
                <ul className="space-y-3">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;

                        return (
                            <li key={item.path}>
                                <Link
                                    href={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                            ? "bg-blue-50 text-blue-800 font-medium"
                                            : "text-white hover:bg-gray-50 hover:text-gray-700"
                                        }`}
                                >
                                    <Icon className="w-5 h-5 shrink-0" />
                                    <span>{item.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-gray-300/60">
                <Link
                    href="/"
                    className="flex items-center gap-3 w-full px-4 py-3 text-gray-200 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200"
                >
                    <Home className="w-5 h-5 shrink-0" />
                    <span>Home</span>
                </Link>
            </div>

            <div className="p-4 border-t border-gray-300/60">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-gray-200 hover:bg-red-100 hover:text-red-600 rounded-lg transition-all duration-200"
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    <span>Log out</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center gap-4 bg-blue-950 px-4 py-3 shadow-md">
                <button
                    onClick={() => setIsOpen(true)}
                    aria-label="Open sidebar"
                    className="text-white p-1.5 rounded-lg hover:bg-blue-800 transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <span className="text-white font-bold text-lg tracking-wide">ADMIN</span>
            </div>

            <aside className="hidden md:flex flex-col w-64 h-screen shrink-0">
                <SidebarContent />
            </aside>
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`md:hidden fixed top-0 left-0 h-full w-72 z-50 shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                aria-label="Admin navigation"
            >
                <SidebarContent />
            </aside>
        </>
    );
}
