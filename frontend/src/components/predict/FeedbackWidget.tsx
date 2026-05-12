"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, Send, Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { clearError, clearSuccess, submitFeedback } from "@/store/feedback/feedbackSlice";


interface FeedbackWidgetProps {
    predictionId: string | null;
    show: boolean;
}

export default function FeedbackWidget({
    predictionId,
    show,
}: FeedbackWidgetProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [rating, setRating] = useState<number | null>(null);
    const [hoveredRating, setHoveredRating] = useState<number | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const [hasSubmitted, setHasSubmitted] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, success } = useSelector((state: RootState) => state.feedback);

    // Reset state when predictionId changes
    useEffect(() => {
        if (predictionId) {
            setHasSubmitted(false);
            dispatch(clearError());
            dispatch(clearSuccess());
            setMessage("");
            setRating(null);
        }
    }, [predictionId]);


    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setHasSubmitted(true);
                setIsOpen(false);
                setMessage("");
                setRating(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    // Don't show if no prediction or already submitted for this prediction
    if (!show || !predictionId || hasSubmitted) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!message.trim()) {
            setSubmitError("Please enter a feedback message");
            return;
        }
        dispatch(submitFeedback({
            prediction_id: predictionId,
            rating,
            message,
        }));
    };

    const handleRatingClick = (value: number) => {
        setRating(value === rating ? null : value);
    };

    return (
        <>
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 group animate-bounce-slow flex items-center gap-2"
                    aria-label="Give Feedback"
                >
                    <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="font-semibold text-base">Feedback</span>
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
                        !
                    </span>
                </button>
            )}

            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-slide-up">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-full">
                                <MessageCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">
                                    Feedback
                                </h3>
                                <p className="text-xs text-blue-100">
                                    How was your prediction?
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-full transition-all"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {success ? (
                        <div className="p-8 text-center">
                            <div className="bg-green-100 text-green-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <h4 className="text-xl font-bold text-gray-800 mb-2">
                                Thank You!
                            </h4>
                            <p className="text-gray-600 text-sm">
                                Your feedback has been submitted successfully.
                            </p>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col flex-1"
                        >
                            <div className="flex-1 p-6 px-4 space-y-5 max-h-96 overflow-y-auto">
                                <div className="flex gap-2">
                                    <div className="bg-blue-600 text-white p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                                        <MessageCircle className="w-4 h-4" />
                                    </div>
                                    <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3 max-w-[80%]">
                                        <p className="text-sm text-gray-800">
                                            Hi! We&apos;d love to hear your
                                            thoughts about this prediction. How
                                            would you rate it?
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2 justify-center py-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() =>
                                                handleRatingClick(star)
                                            }
                                            onMouseEnter={() =>
                                                setHoveredRating(star)
                                            }
                                            onMouseLeave={() =>
                                                setHoveredRating(null)
                                            }
                                            className="transition-transform hover:scale-125"
                                        >
                                            <Star
                                                className={`w-8 h-8 transition-colors ${star <=
                                                    (hoveredRating ||
                                                        rating ||
                                                        0)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>

                                {rating && (
                                    <div className="flex gap-2">
                                        <div className="bg-blue-600 text-white p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                                            <MessageCircle className="w-4 h-4" />
                                        </div>
                                        <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3 max-w-[80%]">
                                            <p className="text-sm text-gray-800">
                                                Great! Now, could you tell us
                                                more about your experience?
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}
                                {submitError && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                                        {submitError}
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-gray-200 bg-gray-50">
                                <div className="flex gap-2">
                                    <textarea
                                        value={message}
                                        onChange={(e) =>
                                            setMessage(e.target.value)
                                        }
                                        placeholder="Share your thoughts..."
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                                        rows={2}
                                        disabled={loading}
                                    />
                                    <button
                                        type="submit"
                                        disabled={
                                            loading || !message.trim()
                                        }
                                        className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-3 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0 self-end"
                                        aria-label="Send"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Send className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Press click send icon to submit your
                                    feedback
                                </p>
                            </div>
                        </form>
                    )}
                </div>
            )}

            <style jsx>{`
                @keyframes bounce-slow {
                    0%,
                    100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }
                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out;
                }
            `}</style>
        </>
    );
}
