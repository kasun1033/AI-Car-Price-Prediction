"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import type { RootState } from "@/store";

export default function ProtectedRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { isAuthenticated, isHydrated } = useSelector(
        (state: RootState) => state.auth
    );

    useEffect(() => {
        if (isHydrated && !isAuthenticated) {
            router.replace("/login");
        }
    }, [isHydrated, isAuthenticated, router]);

    // While Redux is restoring session from localStorage, show a spinner
    if (!isHydrated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-200">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin" />
                    <p className="text-sm text-gray-500 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    // Not authenticated — render nothing while redirect happens
    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
