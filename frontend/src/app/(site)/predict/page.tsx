"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import TheForm from "@/components/predict/TheForm";
import Answer from "@/components/predict/Answer";
import FeedbackWidget from "@/components/predict/FeedbackWidget";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import type { AppDispatch } from "@/store";
import {
    clearPredictError,
    clearPredictResult,
    clearPredictSuccess,
    fetchMetadata,
    predict,
} from "@/store/prediction/predictionSlice";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// default form state
const EMPTY_FORM = {
    yom: 0,
    engine_cc: 0,
    millage_km: 0,
    brand: "",
    model: "",
    gear: "",
    fuel_type: "",
    condition: "",
    air_condition: "Yes",
    power_steering: "Yes",
    power_mirror: "Yes",
    power_window: "Yes",
};

export default function PredictPage() {
    const [formData, setFormData] = useState(EMPTY_FORM);

    const {
        predictionResult,
        isPredictLoading,
        predictError,
        isPredictSuccess,
        metadata,
        isMetadataLoading,
    } = useSelector((state: RootState) => state.prediction);

    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    useEffect(() => {
        if (!metadata) {
            dispatch(fetchMetadata()); // metadata only needs to return `conditions` now

        }
    }, [dispatch, metadata]);

    // Generic input handler (unchanged — used by inputs + unchanged selects)
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: ["yom", "engine_cc", "millage_km"].includes(name)
                ? Number(value)
                : value,
        }));
    };

    const handleFieldChange = (name: string, value: string | number) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(clearPredictError());
        dispatch(predict(formData));
    };

    const handleAnotherPrediction = () => {
        setFormData(EMPTY_FORM);
        dispatch(clearPredictError());
        dispatch(clearPredictSuccess());
        dispatch(clearPredictResult());
    };

    const handleBackToDashboard = () => {
        dispatch(clearPredictError());
        dispatch(clearPredictSuccess());
        dispatch(clearPredictResult());
        router.back();
    };

    return (
        <ProtectedRoute>
            <main className="h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-100 to-slate-200 overflow-hidden flex flex-col">
                <section className="bg-gradient-to-br from-blue-800 via-blue-900 to-indigo-900">
                    <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 pt-6  pb-16 ">
                        <div className="">
                            <button
                                onClick={handleBackToDashboard}
                                className="inline-flex items-center gap-2 px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </section>

                <div className="max-w-screen-2xl w-full mx-auto flex flex-col flex-1 min-h-0 -mt-10 px-6 lg:px-10 pb-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 flex-1 min-h-0">
                        <TheForm
                            formData={formData}
                            isLoading={isPredictLoading}
                            isMetadataLoading={isMetadataLoading}
                            metadata={metadata}
                            onSubmit={handleSubmit}
                            onChange={handleChange}
                            onFieldChange={handleFieldChange}
                        />

                        <Answer
                            prediction={predictionResult}
                            isLoading={isPredictLoading}
                            isError={predictError}
                            onAnotherPrediction={handleAnotherPrediction}
                        />
                    </div>
                </div>

                <FeedbackWidget
                    predictionId={predictionResult?.prediction_id || null}
                    show={isPredictSuccess && !!predictionResult}
                />
            </main>
        </ProtectedRoute>
    );
}
