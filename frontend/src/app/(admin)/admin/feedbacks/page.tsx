"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { fetchAllFeedbacks, deleteFeedback } from "@/store/admin/adminSlice";
import AdminSidebar from "@/components/admin/AdminSidebar";
import {
    Trash2,
    Star,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    Car,
    DollarSign,
} from "lucide-react";

export default function FeedbackManagement() {
    const dispatch = useDispatch<AppDispatch>();
    const { feedbacks, isFeedbacksLoading, feedbacksError, isDeleting } =
        useSelector((state: RootState) => state.admin);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [expandedFeedback, setExpandedFeedback] = useState<string | null>(
        null,
    );

    useEffect(() => {
        dispatch(fetchAllFeedbacks({ skip: 0, limit: 100 }));
    }, [dispatch]);

    const handleDeleteFeedback = async (feedbackId: string) => {
        await dispatch(deleteFeedback(feedbackId));
        setDeleteConfirm(null);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const renderStars = (rating: number | null) => {
        if (!rating)
            return <span className="text-gray-400 text-sm">No rating</span>;

        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                    />
                ))}
                <span className="text-sm text-gray-600 ml-1">
                    ({rating.toFixed(1)})
                </span>
            </div>
        );
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-LK", {
            style: "currency",
            currency: "LKR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const toggleExpanded = (feedbackId: string) => {
        setExpandedFeedback(
            expandedFeedback === feedbackId ? null : feedbackId,
        );
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <AdminSidebar />

            <main className="flex-1 overflow-y-auto bg-gray-100 pt-14 md:pt-0">
                <div className="bg-blue-950 border-b border-gray-200 px-8 py-6">
                    <h1 className="text-[28px] font-bold text-white">
                        Feedbacks
                    </h1>
                    <p className="text-gray-200 mt-2">
                        Manage user feedbacks and ratings
                    </p>
                </div>

                <div className="p-8">
                    {isFeedbacksLoading ? (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                            <div className="animate-pulse space-y-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div
                                        key={i}
                                        className="h-24 bg-gray-200 rounded"
                                    ></div>
                                ))}
                            </div>
                        </div>
                    ) : feedbacksError ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                            <p className="text-red-600">{feedbacksError}</p>
                        </div>
                    ) : feedbacks.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                            <p className="text-gray-500">No feedbacks found</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {feedbacks.map((feedback) => (
                                <div
                                    key={feedback.id}
                                    className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                {/* User Info */}
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold">
                                                        {feedback.user_name
                                                            ? feedback.user_name
                                                                .split(" ")
                                                                .map(
                                                                    (n) =>
                                                                        n[0],
                                                                )
                                                                .join("")
                                                                .toUpperCase()
                                                                .slice(0, 2)
                                                            : "?"}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">
                                                            {feedback.user_name ||
                                                                "Unknown User"}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {feedback.user_email ||
                                                                "No email"}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    {renderStars(
                                                        feedback.rating,
                                                    )}
                                                </div>

                                                <p className="text-gray-700 mb-3">
                                                    {feedback.message}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {formatDate(
                                                        feedback.created_at,
                                                    )}
                                                </p>
                                            </div>

                                            <div className="ml-4">
                                                {deleteConfirm ===
                                                    feedback.id ? (
                                                    <div className="flex flex-col gap-2">
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteFeedback(
                                                                    feedback.id,
                                                                )
                                                            }
                                                            disabled={
                                                                isDeleting
                                                            }
                                                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                setDeleteConfirm(
                                                                    null,
                                                                )
                                                            }
                                                            disabled={
                                                                isDeleting
                                                            }
                                                            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() =>
                                                            setDeleteConfirm(
                                                                feedback.id,
                                                            )
                                                        }
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete feedback"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {feedback.prediction_id && (
                                        <div className="border-t border-gray-200">
                                            <button
                                                onClick={() =>
                                                    toggleExpanded(feedback.id)
                                                }
                                                className="w-full px-6 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Car className="w-4 h-4 text-blue-600" />
                                                    <span className="text-sm font-medium text-gray-700">
                                                        Prediction Details
                                                    </span>
                                                    {feedback.prediction_output && (
                                                        <span className="text-sm text-gray-500">
                                                            •{" "}
                                                            {formatPrice(
                                                                feedback.prediction_output,
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                                {expandedFeedback ===
                                                    feedback.id ? (
                                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                                )}
                                            </button>

                                            {expandedFeedback ===
                                                feedback.id && (
                                                    <div className="px-6 pb-6 space-y-4">
                                                        {feedback.prediction_output && (
                                                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <DollarSign className="w-5 h-5 text-green-600" />
                                                                    <h4 className="font-semibold text-green-900">
                                                                        Predicted
                                                                        Price
                                                                    </h4>
                                                                </div>
                                                                <p className="text-2xl font-bold text-green-700">
                                                                    {formatPrice(
                                                                        feedback.prediction_output,
                                                                    )}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {feedback.prediction_input && (
                                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                                <h4 className="font-semibold text-blue-900 mb-3">
                                                                    Car Details
                                                                </h4>
                                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                                    {Object.entries(
                                                                        feedback.prediction_input,
                                                                    ).map(
                                                                        ([
                                                                            key,
                                                                            value,
                                                                        ]) => (
                                                                            <div
                                                                                key={
                                                                                    key
                                                                                }
                                                                            >
                                                                                <p className="text-xs text-blue-700 font-medium uppercase">
                                                                                    {key.replace(
                                                                                        /_/g,
                                                                                        " ",
                                                                                    )}
                                                                                </p>
                                                                                <p className="text-sm text-blue-900 font-semibold">
                                                                                    {String(
                                                                                        value,
                                                                                    )}
                                                                                </p>
                                                                            </div>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {feedback.prediction_warnings &&
                                                            feedback
                                                                .prediction_warnings
                                                                .length > 0 && (
                                                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                                                    <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                                                                        <AlertCircle className="w-4 h-4" />
                                                                        Warnings
                                                                    </h4>
                                                                    <ul className="list-disc list-inside space-y-1">
                                                                        {feedback.prediction_warnings.map(
                                                                            (
                                                                                warning,
                                                                                index,
                                                                            ) => (
                                                                                <li
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                    className="text-sm text-amber-800"
                                                                                >
                                                                                    {
                                                                                        warning
                                                                                    }
                                                                                </li>
                                                                            ),
                                                                        )}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                    </div>
                                                )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
