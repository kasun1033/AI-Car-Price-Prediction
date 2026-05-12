"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import type { AppDispatch } from "@/store";
import { fetchPredictionHistory, deletePrediction } from "@/store/prediction/predictionSlice";
import { PredictionHistoryOut } from "@/store/prediction/types";
import {
    Car,
    ChevronLeft,
    ChevronRight,
    History,
    AlertTriangle,
    RefreshCw,
    Trash2,
} from "lucide-react";
import PredictionDetailModal from "@/components/dashboard/PredictionDetailModal";
import DeleteConfirmDialog from "@/components/dashboard/DeleteConfirmDialog";
import { LoadingSkeleton } from "./loadingSkelton";

const CARD_GRADIENTS = [
    "from-blue-500 to-blue-600",
    "from-indigo-500 to-indigo-600",
    "from-purple-500 to-purple-600",
    "from-sky-500 to-sky-600",
    "from-violet-500 to-violet-600",
    "from-blue-600 to-indigo-700",
];

const CARD_GRADIENT_PREFIX = "bg-linear-to-br";
const PAGE_SIZE = 20;

function formatPrice(amount: number) {
    return amount.toLocaleString("en-LK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

// Format date to relative time
function formatDate(iso: string | null) {
    if (!iso) return "Unknown date";
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60)
        return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
        return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return d.toLocaleDateString("en-LK", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export default function PredictionHistory() {
    const dispatch = useDispatch<AppDispatch>();
    const {
        predictionHistory,
        historyPagination,
        isHistoryLoading,
        historyError,
        isDeleting,
    } = useSelector((state: RootState) => state.prediction);

    const [selected, setSelected] = useState<PredictionHistoryOut | null>(null);
    const [toDelete, setToDelete] = useState<PredictionHistoryOut | null>(null);
    const [hasFetched, setHasFetched] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch prediction history on mount and when page changes.
    useEffect(() => {
        dispatch(fetchPredictionHistory({ limit: PAGE_SIZE, page: currentPage })).finally(() =>
            setHasFetched(true),
        );
    }, [dispatch, currentPage]);

    const handleRefresh = () => {
        dispatch(fetchPredictionHistory({ limit: PAGE_SIZE, page: currentPage }));
    };

    const handlePageChange = (nextPage: number) => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setCurrentPage(nextPage);
    };

    const handleDeleteConfirm = async () => {
        if (!toDelete) return;

        const shouldGoToPreviousPage =
            predictionHistory.length === 1 && currentPage > 1;

        await dispatch(deletePrediction(toDelete.id));
        setToDelete(null);
        setSelected((prev) => (prev?.id === toDelete.id ? null : prev));

        if (shouldGoToPreviousPage) {
            setCurrentPage((prev) => prev - 1);
            return;
        }

        dispatch(fetchPredictionHistory({ limit: PAGE_SIZE, page: currentPage }));
    };

    if (isHistoryLoading || !hasFetched) {
        return <LoadingSkeleton />;
    }

    if (historyError) {
        return (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">
                        Recent Predictions
                    </h2>
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Retry
                    </button>
                </div>
                <div className="flex items-center justify-center py-16 px-6">
                    <div className="text-center max-w-xs">
                        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <AlertTriangle className="w-7 h-7 text-red-500" />
                        </div>
                        <p className="text-sm font-semibold text-gray-800 mb-1">
                            Failed to load predictions
                        </p>
                        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-2">
                            {historyError}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (predictionHistory.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900">
                        Recent Predictions
                    </h2>
                </div>
                <div className="flex items-center justify-center py-16 px-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <History className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                            No predictions yet
                        </p>
                        <p className="text-xs text-gray-400">
                            Your prediction history will appear here once you
                            make your first prediction.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h2 className="text-base sm:text-[19px] font-bold text-gray-900">
                            Recent Predictions
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {historyPagination?.total ?? predictionHistory.length} prediction
                            {(historyPagination?.total ?? predictionHistory.length) !== 1 ? "s" : ""} total
                        </p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors cursor-pointer"
                        aria-label="Refresh predictions"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span className="hidden sm:inline">Refresh</span>
                    </button>
                </div>

                {/* List */}
                <div className="divide-y divide-gray-200">
                    {predictionHistory.map((item, index) => {
                        const p = item.input_payload;
                        const gradient =
                            CARD_GRADIENTS[index % CARD_GRADIENTS.length];

                        return (
                            <div
                                key={item.id}
                                className="flex items-center group"
                            >
                                <button
                                    onClick={() => setSelected(item)}
                                    className="flex-1 min-w-0 px-4 sm:px-6 py-3.5 sm:py-4 hover:bg-gray-100 active:bg-gray-100 transition-colors duration-150 text-left cursor-pointer"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                                            <div
                                                className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 ${CARD_GRADIENT_PREFIX} ${gradient} rounded-lg flex items-center justify-center`}
                                            >
                                                <Car className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-gray-900 text-sm truncate">
                                                    {p.yom} {p.brand} {p.model}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                                                    <span>
                                                        {formatDate(
                                                            item.created_at,
                                                        )}
                                                    </span>
                                                    <span className="hidden sm:inline text-gray-200">
                                                        •
                                                    </span>
                                                    <span className="hidden sm:inline capitalize">
                                                        {p.fuel_type} · {p.gear}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900 text-sm sm:text-base whitespace-nowrap">
                                                    Rs.&nbsp;
                                                    {formatPrice(
                                                        item.predicted_price_lkr,
                                                    )}
                                                </p>
                                                {item.warnings &&
                                                    item.warnings.length > 0 && (
                                                        <p className="text-[10px] text-amber-500 flex items-center justify-end gap-0.5 mt-0.5">
                                                            <AlertTriangle className="w-2.5 h-2.5" />
                                                            {item.warnings.length}{" "}
                                                            warning
                                                            {item.warnings.length >
                                                                1
                                                                ? "s"
                                                                : ""}
                                                        </p>
                                                    )}
                                            </div>
                                            <span className="w-7 h-7 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center shrink-0 transition-colors cursor-pointer">
                                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                            </span>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setToDelete(item);
                                    }}
                                    className="shrink-0 mr-3 sm:mr-4 w-8 h-8 rounded-full flex items-center justify-center  text-red-400 bg-red-50 hover:bg-red-100 hover:text-red-500 transition-all duration-150 cursor-pointer"
                                    aria-label="Delete prediction"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="px-4 sm:px-6 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-xs text-gray-600">
                        Page {historyPagination?.page ?? currentPage} of {historyPagination?.total_pages ?? 1}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() =>
                                handlePageChange(Math.max(1, currentPage - 1))
                            }
                            disabled={!historyPagination?.has_previous || isHistoryLoading}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!historyPagination?.has_next || isHistoryLoading}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Detail modal */}
            {selected && (
                <PredictionDetailModal
                    item={selected}
                    onClose={() => setSelected(null)}
                />
            )}

            {/* Delete confirm dialog */}
            {toDelete && (
                <DeleteConfirmDialog
                    itemLabel={`${toDelete.input_payload.yom} ${toDelete.input_payload.brand} ${toDelete.input_payload.model}`}
                    isDeleting={isDeleting}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setToDelete(null)}
                />
            )}
        </>
    );
}
