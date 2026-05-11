"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { isAuthenticated, user, isHydrated } = useSelector(
        (state: RootState) => state.auth,
    );

    useEffect(() => {
        if (!isHydrated) return;

        if (!isAuthenticated) {
            router.replace("/admin/login");
            return;
        }

        if (user?.role !== "admin") {
            router.replace("/");
        }
    }, [isAuthenticated, user, router, isHydrated]);

    if (!isHydrated || !isAuthenticated || user?.role !== "admin") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200">
                <div className="animate-pulse text-gray-600">Loading...</div>
            </div>
        );
    }

    return <div className="min-h-screen bg-gray-50">{children}</div>;
}
