import { PredictionResponse } from "@/store/prediction/types";
import {
    AlertTriangle,
    BadgeCheck,
    BarChart3,
    CircleAlert,
    Loader2,
} from "lucide-react";

interface AnswerProps {
    prediction: PredictionResponse | null;
    isLoading: boolean;
    isError: null | string | undefined;
    onAnotherPrediction: () => void;
}

export default function Answer({ prediction, isLoading, isError, onAnotherPrediction }: AnswerProps) {
    // Loading state
    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-3 sm:p-4 md:p-6 flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="relative mb-4 sm:mb-6 flex justify-center">
                        <Loader2 className="animate-spin h-12 w-12 sm:h-16 sm:w-16 text-blue-600" />
                    </div>
                    <p className="text-gray-900 font-semibold text-sm sm:text-base md:text-lg">
                        Analyzing Your Vehicle
                    </p>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">
                        Processing car details…
                    </p>
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="bg-white rounded-xl shadow-xl border border-red-200 p-3 sm:p-4 md:p-6 h-full flex items-center justify-center">
                <div className="text-center max-w-xs">
                    <div className="mb-3 sm:mb-4 md:mb-6 flex justify-center">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-red-100 rounded-full flex items-center justify-center">
                            <CircleAlert className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-red-600" />
                        </div>
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-red-700 mb-1.5 sm:mb-2">
                        Prediction Failed
                    </h3>
                    <p className="text-xs sm:text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-2">
                        {isError}
                    </p>
                </div>
            </div>
        );
    }

    // Result state 
    if (prediction !== null) {
        const formattedPrice = prediction.predicted_price_lkr.toLocaleString("en-LK", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        const hasWarnings = prediction.warnings && prediction.warnings.length > 0;

        return (
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-3 sm:p-4 md:p-6 h-full overflow-y-auto scrollbar-hide flex flex-col justify-center">
                <div className="space-y-3 sm:space-y-4 md:space-y-5 w-full">

                    {/* ── Price header ── */}
                    <div className="text-center pb-3 sm:pb-4 md:pb-5 border-b border-gray-200">
                        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 bg-green-50 text-green-700 rounded-full mb-2 sm:mb-3 md:mb-4">
                            <BadgeCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="text-xs sm:text-sm font-semibold">Price Calculated</span>
                        </div>

                        <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1.5 sm:mb-2 md:mb-3 uppercase tracking-wide">
                            Estimated Market Value
                        </p>

                        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-1 sm:mb-1.5 md:mb-2">
                            Rs.&nbsp;{formattedPrice}
                        </p>

                        <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider">
                            Sri Lankan Rupees (LKR)
                        </p>

                        <p className="text-xs sm:text-sm text-gray-500 mt-1.5 sm:mt-2">
                            Based on current market trends and vehicle specifications
                        </p>
                    </div>

                    {/* ── Warnings ── */}
                    {hasWarnings && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 sm:p-4 space-y-2">
                            <div className="flex items-center gap-2 text-amber-700 mb-1">
                                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wide">
                                    Prediction Warnings
                                </span>
                            </div>
                            <ul className="space-y-1.5">
                                {prediction?.warnings?.map((warning, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-start gap-2 text-xs sm:text-sm text-amber-800"
                                    >
                                        <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-amber-500" />
                                        <span>{warning}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Make anthoer prediction */}
                    <div className="flex justify-center">
                        <button
                            onClick={onAnotherPrediction}
                            className="px-6 py-2 bg-gradient-to-r from-blue-700 to-blue-800 text-white font-medium rounded-lg hover:from-blue-950 hover:to-blue-950 transform transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
                        >
                            Make Another Prediction
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    /* ── Default / idle state ── */
    return (
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-xl border border-gray-200 p-3 sm:p-4 md:p-6 h-full flex items-center justify-center">
            <div className="text-center">
                <div className="mb-3 sm:mb-4 md:mb-6 flex justify-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                        <BarChart3 className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-blue-600" />
                    </div>
                </div>
                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2 md:mb-3">
                    Your Result Appears Here
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                    Fill in the form and click &quot;Predict Price&quot; to see your car&apos;s estimated value
                </p>
                <div className="mt-3 sm:mt-4 md:mt-6 pt-3 sm:pt-4 md:pt-6 border-t border-gray-200" />
            </div>
        </div>
    );
}
