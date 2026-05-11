"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { fetchAdminStats } from "@/store/admin/adminSlice";
import AdminSidebar from "@/components/admin/AdminSidebar";
import {
    Users,
    BarChart3,
    MessageSquare,
    UserCheck,
    TrendingUp,
    Star,
} from "lucide-react";

export default function AdminDashboard() {
    const dispatch = useDispatch<AppDispatch>();
    const { stats, isStatsLoading, statsError } = useSelector(
        (state: RootState) => state.admin,
    );

    useEffect(() => {
        dispatch(fetchAdminStats());
    }, [dispatch]);

    return (
        <div className="flex h-screen overflow-hidden">
            <AdminSidebar />

            <main className="flex-1 overflow-y-auto bg-gray-100 pt-14 md:pt-0">
                <div className="bg-blue-950 border-b border-gray-200 px-8 py-6">
                    <h1 className="text-[28px] font-bold text-white">
                        Dashboard
                    </h1>
                    <p className="text-gray-200 mt-2">
                        Overview of your system statistics
                    </p>
                </div>

                <div className="p-8">
                    {isStatsLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 animate-pulse"
                                >
                                    <div className="h-10 bg-gray-200 rounded w-10 mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                                </div>
                            ))}
                        </div>
                    ) : statsError ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                            <p className="text-red-600">{statsError}</p>
                        </div>
                    ) : stats ? (
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Users className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                                <h3 className="text-gray-600 text-sm font-medium mb-1">
                                    Total Users
                                </h3>
                                <p className="text-3xl font-bold text-gray-900">
                                    {stats.total_users}
                                </p>
                            </div>

                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <BarChart3 className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                                <h3 className="text-gray-600 text-sm font-medium mb-1">
                                    Total Predictions
                                </h3>
                                <p className="text-3xl font-bold text-gray-900">
                                    {stats.total_predictions}
                                </p>
                            </div>

                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <MessageSquare className="w-6 h-6 text-purple-600" />
                                    </div>
                                </div>
                                <h3 className="text-gray-600 text-sm font-medium mb-1">
                                    Total Feedbacks
                                </h3>
                                <p className="text-3xl font-bold text-gray-900">
                                    {stats.total_feedbacks}
                                </p>
                            </div>

                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <UserCheck className="w-6 h-6 text-indigo-600" />
                                    </div>
                                </div>
                                <h3 className="text-gray-600 text-sm font-medium mb-1">
                                    Active Users
                                </h3>
                                <p className="text-3xl font-bold text-gray-900">
                                    {stats.active_users}
                                </p>
                            </div>

                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <TrendingUp className="w-6 h-6 text-orange-600" />
                                    </div>
                                </div>
                                <h3 className="text-gray-600 text-sm font-medium mb-1">
                                    Recent Signups (30 days)
                                </h3>
                                <p className="text-3xl font-bold text-gray-900">
                                    {stats.recent_signups}
                                </p>
                            </div>

                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <Star className="w-6 h-6 text-yellow-600" />
                                    </div>
                                </div>
                                <h3 className="text-gray-600 text-sm font-medium mb-1">
                                    Average Rating
                                </h3>
                                <p className="text-3xl font-bold text-gray-900">
                                    {stats.avg_rating
                                        ? stats.avg_rating.toFixed(1)
                                        : "N/A"}
                                </p>
                            </div>
                        </div>
                    ) : null}
                </div>
            </main>
        </div>
    );
}
