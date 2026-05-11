"use client";
import Link from "next/link";
import { BarChart3, Car, User } from "lucide-react";
import PredictionHistory from "@/components/dashboard/PredictionHistory";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { fetchMetadata } from "@/store/prediction/predictionSlice";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Dashboard() {
    const dispatch = useDispatch<AppDispatch>();
    const { metadata, isMetadataLoading, historyPagination, isHistoryLoading } =
        useSelector((state: RootState) => state.prediction);

    useEffect(() => {
        dispatch(fetchMetadata());
    }, [dispatch]);

    const user = useSelector((state: RootState) => state.auth.user);

    const formatName = (name?: string | null) => {
        if (!name) return "";
        return name
            .split(" ")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ");
    };

    return (
        <ProtectedRoute>
            <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200">
                <section className="bg-gradient-to-br from-blue-800 via-blue-900 to-indigo-900 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-14 pt-8 sm:pt-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">
                                    Dashboard
                                </h1>
                                <p className="text-blue-100 text-sm sm:text-base">
                                    Monitor your predictions and insights
                                </p>
                            </div>
                            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3 shadow-lg">
                                <div className="flex flex-col gap-1">
                                    <span className="text-blue-200 text-xs font-medium tracking-wide">
                                        Welcome back 👋
                                    </span>
                                    <span className="text-white text-[17px] font-semibold leading-tight">
                                        {formatName(user?.full_name)}
                                    </span>
                                    <span className="text-blue-300 text-xs mt-1.5 truncate max-w-[180px]">
                                        {user?.email}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-10">
                        <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between ">
                                <div>
                                    <h3 className="text-gray-500 text-[13px] font-medium mb-1">
                                        Your Total Predictions
                                    </h3>
                                    {isHistoryLoading ? (
                                        <p className="text-[23px] font-bold text-gray-300 animate-pulse select-none">
                                            00
                                        </p>
                                    ) : (
                                        <p className="text-[23px] font-bold text-gray-900">
                                            {historyPagination?.total ?? 0}
                                        </p>
                                    )}
                                </div>
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <BarChart3 className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between ">
                                <div>
                                    <h3 className="text-gray-500 text-[13px] font-medium mb-1">
                                        Car Brands
                                    </h3>
                                    {isMetadataLoading ? (
                                        <p className="text-[23px] font-bold text-gray-300 animate-pulse select-none">
                                            00
                                        </p>
                                    ) : (
                                        <p className="text-[23px] font-bold text-gray-900">
                                            {metadata?.brands_count}
                                        </p>
                                    )}
                                </div>
                                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <Car className="w-5 h-5 text-indigo-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between ">
                                <div>
                                    <h3 className="text-gray-500 text-[13px] font-medium mb-1">
                                        Car Models
                                    </h3>
                                    {isMetadataLoading ? (
                                        <p className="text-[23px] font-bold text-gray-300 animate-pulse select-none">
                                            00
                                        </p>
                                    ) : (
                                        <p className="text-[23px] font-bold text-gray-900">
                                            {metadata?.models_count}
                                        </p>
                                    )}
                                </div>
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <Car className="w-5 h-5 text-orange-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between ">
                                <div>
                                    <h3 className="text-gray-500 text-[13px] font-medium mb-1">
                                        Model Accuracy
                                    </h3>
                                    {isMetadataLoading ? (
                                        <p className="text-[23px] font-bold text-gray-300 animate-pulse select-none">
                                            00
                                        </p>
                                    ) : (
                                        <p className="text-[23px] font-bold text-gray-900">
                                            95.5%
                                        </p>
                                    )}
                                </div>
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <Car className="w-5 h-5 text-orange-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-4">
                    <div className=" flex flex-col sm:flex-row items-center gap-4 sm:gap-8 justify-center">
                        <h2 className="text-[20px] sm:text-[27px] font-bold text-gray-800 mb-1 ">
                            Ready to Predict Your Car's Price?
                        </h2>
                        <Link
                            href="/predict"
                            className="px-6 py-4 bg-gradient-to-br from-blue-800 via-blue-900 to-indigo-900 text-white rounded-lg font-semibold text-[16px]  hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 transform cursor-pointer"
                        >
                            Start New Prediction →
                        </Link>
                    </div>
                </section>

                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="">
                        <div className="lg:col-span-2">
                            <PredictionHistory />
                        </div>
                    </div>
                </section>
            </main>
        </ProtectedRoute>
    );
}
