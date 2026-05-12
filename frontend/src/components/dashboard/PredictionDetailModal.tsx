"use client";

import { useEffect } from "react";
import { PredictionHistoryOut } from "@/store/prediction/types";
import {
    Car,
    X,
    AlertTriangle,
    Calendar,
    Gauge,
    Fuel,
    Settings2,
    Zap,
    Wind,
    Eye,
    SquareChevronRight,
    MessageSquare,
    Star,
} from "lucide-react";

function formatPrice(amount: number) {
    return amount.toLocaleString("en-LK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function formatFullDate(iso: string | null) {
    if (!iso) return "Unknown";
    const d = new Date(iso);
    return d.toLocaleString("en-LK", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function DetailRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
                <span className="text-gray-400">{icon}</span>
                {label}
            </div>
            <span className="text-sm font-semibold text-gray-800 text-right max-w-[55%]">
                {value}
            </span>
        </div>
    );
}

export interface PredictionDetailModalProps {
    item: PredictionHistoryOut;
    onClose: () => void;
}

export default function PredictionDetailModal({
    item,
    onClose,
}: PredictionDetailModalProps) {
    const prediction_data = item.input_payload;
    const formattedPrice = formatPrice(item.predicted_price_lkr);
    const hasWarnings = item.warnings && item.warnings.length > 0;
    const hasFeedback = item.feedbacks && item.feedbacks.length > 0;
    const feedback = hasFeedback ? item.feedbacks[0] : null;

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    // Prevent body scroll while modal open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Prediction details"
        >
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full  sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slide-up max-h-[92dvh] sm:max-h-[85vh] flex flex-col">
                <div className="bg-linear-to-br from-blue-800 via-blue-900 to-indigo-900 px-5 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                            <Car className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-white font-bold text-base leading-tight">
                                {prediction_data.brand} {prediction_data.model}
                            </p>
                            <p className="text-blue-200 text-xs mt-0.5">
                                {prediction_data.yom} · Prediction details
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Close details"
                    >
                        <X className="w-4 h-4 text-white" />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
                    <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-1">
                            Estimated Market Value
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                            Rs.&nbsp;{formattedPrice}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-wider">
                            Sri Lankan Rupees (LKR)
                        </p>
                    </div>

                    {hasWarnings && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-1.5">
                            <div className="flex items-center gap-2 text-amber-700 mb-1">
                                <AlertTriangle className="w-4 h-4 shrink-0" />
                                <span className="text-xs font-semibold uppercase tracking-wide">
                                    Prediction Warnings
                                </span>
                            </div>
                            <ul className="space-y-1">
                                {item.warnings!.map((w, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-2 text-xs text-amber-800"
                                    >
                                        <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0 text-amber-500" />
                                        {w}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            Vehicle Specifications
                        </h3>
                        <div className="bg-white border border-gray-100 rounded-xl px-4 shadow-sm">
                            <DetailRow
                                icon={<Car className="w-3.5 h-3.5" />}
                                label="Brand"
                                value={prediction_data.brand}
                            />
                            <DetailRow
                                icon={
                                    <SquareChevronRight className="w-3.5 h-3.5" />
                                }
                                label="Model"
                                value={prediction_data.model}
                            />
                            <DetailRow
                                icon={<Calendar className="w-3.5 h-3.5" />}
                                label="Year of Manufacture"
                                value={String(prediction_data.yom)}
                            />
                            <DetailRow
                                icon={<Gauge className="w-3.5 h-3.5" />}
                                label="Engine CC"
                                value={`${prediction_data.engine_cc.toLocaleString()} cc`}
                            />
                            <DetailRow
                                icon={<Gauge className="w-3.5 h-3.5" />}
                                label="Mileage"
                                value={`${prediction_data.millage_km.toLocaleString()} km`}
                            />
                            <DetailRow
                                icon={<Settings2 className="w-3.5 h-3.5" />}
                                label="Gear"
                                value={prediction_data.gear}
                            />
                            <DetailRow
                                icon={<Fuel className="w-3.5 h-3.5" />}
                                label="Fuel Type"
                                value={prediction_data.fuel_type}
                            />
                            <DetailRow
                                icon={<Zap className="w-3.5 h-3.5" />}
                                label="Condition"
                                value={prediction_data.condition}
                            />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            Features
                        </h3>
                        <div className="bg-white border border-gray-100 rounded-xl px-4 shadow-sm">
                            <DetailRow
                                icon={<Wind className="w-3.5 h-3.5" />}
                                label="Air Conditioning"
                                value={prediction_data.air_condition}
                            />
                            <DetailRow
                                icon={<Settings2 className="w-3.5 h-3.5" />}
                                label="Power Steering"
                                value={prediction_data.power_steering}
                            />
                            <DetailRow
                                icon={<Eye className="w-3.5 h-3.5" />}
                                label="Power Mirror"
                                value={prediction_data.power_mirror}
                            />
                            <DetailRow
                                icon={<Eye className="w-3.5 h-3.5" />}
                                label="Power Window"
                                value={prediction_data.power_window}
                            />
                        </div>
                    </div>

                    {hasFeedback && feedback && (
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                            <div className="flex items-center gap-2 text-green-700 mb-2">
                                <MessageSquare className="w-4 h-4 shrink-0" />
                                <span className="text-xs font-semibold uppercase tracking-wide">
                                    Your Feedback
                                </span>
                            </div>
                            {feedback.rating && (
                                <div className="flex items-center gap-1 mb-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-4 h-4 ${
                                                star <= feedback.rating!
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                            }`}
                                        />
                                    ))}
                                    <span className="text-sm font-medium text-gray-700 ml-1">
                                        {feedback.rating.toFixed(1)}
                                    </span>
                                </div>
                            )}
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {feedback.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                Submitted on{" "}
                                {formatFullDate(feedback.created_at)}
                            </p>
                        </div>
                    )}

                    <div className="flex items-center gap-2 text-xs text-gray-400 pb-1">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span>
                            Predicted on {formatFullDate(item.created_at)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
