'use client'
import { useDispatch, useSelector } from "react-redux";
import { fetchPredictionCount } from "@/store/prediction/predictionSlice";
import { useEffect } from "react";
import { AppDispatch, RootState } from "@/store";

export default function Home() {

    const dispatch = useDispatch<AppDispatch>();
    const { predictionCount, isCountLoading } = useSelector(
        (state: RootState) => state.prediction,
    );

    useEffect(() => {
        dispatch(fetchPredictionCount());
    }, [dispatch]);

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-800 via-blue-900 to-indigo-900 text-white">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                    <div className="text-center space-y-8">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-sm">
                            <span className="text-xs font-medium">
                                🚀 Powered by Advanced ML
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                            AI-Powered Car Price
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
                                Prediction
                            </span>
                        </h1>

                        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-blue-100 leading-relaxed">
                            Get accurate car price predictions using advanced
                            machine learning. Find the best deals and make
                            informed decisions.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                            <a href="/dashboard" className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-base hover:bg-blue-50 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 transform cursor-pointer">
                                Get Started
                            </a>
                            <a
                                href="#how-it-works"
                                className="px-8 py-4 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 text-white rounded-lg font-semibold text-base hover:bg-blue-500/30 transition-all duration-200 cursor-pointer"
                            >
                                Learn More
                            </a>
                        </div>

                        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                                <div className="text-2xl font-bold mb-2">
                                    {isCountLoading ? "00" : predictionCount?.count}+
                                </div>
                                <div className="text-blue-200 text-sm">
                                    Predictions Made
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                                <div className="text-2xl font-bold mb-2">
                                    95%
                                </div>
                                <div className="text-blue-200 text-sm">
                                    Accuracy Rate
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                                <div className="text-2xl font-bold mb-2">
                                    24/7
                                </div>
                                <div className="text-blue-200 text-sm">
                                    Available
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 leading-none overflow-hidden">
                    <svg
                        viewBox="0 0 1440 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full block -mb-px"
                        preserveAspectRatio="none"
                        style={{ verticalAlign: 'bottom' }}
                    >
                        <path
                            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
                            fill="rgb(248, 250, 252)"
                        />
                    </svg>
                </div>
            </section>

            {/* How It Works Section */}
            <section
                id="how-it-works"
                className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 scroll-mt-4 bg-gradient-to-b from-slate-50 to-white"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <div className="inline-block mb-3">
                            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1.5 rounded-full">
                                Our Process
                            </span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
                            How It Works
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                            Experience a streamlined, data-driven approach to
                            car price prediction
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                        {/* Step 1 */}
                        <div className="relative">
                            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 h-full">
                                <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                                            <span className="text-white text-xl sm:text-2xl font-bold">
                                                1
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                                            Input Vehicle Information
                                        </h3>
                                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                                            Provide comprehensive details
                                            including make, model, year,
                                            mileage, condition, and additional
                                            features to ensure accurate
                                            analysis.
                                        </p>
                                        <div className="flex items-center text-xs sm:text-sm text-blue-600 font-medium">
                                            <svg
                                                className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            Simple & Quick
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative">
                            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 h-full">
                                <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                                            <span className="text-white text-xl sm:text-2xl font-bold">
                                                2
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                                            Advanced AI Analysis
                                        </h3>
                                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                                            Our sophisticated Random Forest
                                            algorithm processes thousands of
                                            data points to calculate the most
                                            accurate market value for your
                                            vehicle.
                                        </p>
                                        <div className="flex items-center text-xs sm:text-sm text-indigo-600 font-medium">
                                            <svg
                                                className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                                />
                                            </svg>
                                            95% Accuracy
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative">
                            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 h-full">
                                <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                                            <span className="text-white text-xl sm:text-2xl font-bold">
                                                3
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                                            Receive Detailed Report
                                        </h3>
                                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                                            Get instant access to your vehicle's
                                            predicted value.
                                        </p>
                                        <div className="flex items-center text-xs sm:text-sm text-green-600 font-medium">
                                            <svg
                                                className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                />
                                            </svg>
                                            Instant Results
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 mb-4">
                                <svg
                                    className="w-7 h-7 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                </svg>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                                Instant Results
                            </h4>
                            <p className="text-gray-600 text-xs">
                                Get predictions in seconds
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mb-4">
                                <svg
                                    className="w-7 h-7 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                                Accurate Data
                            </h4>
                            <p className="text-gray-600 text-xs">
                                ML-powered predictions
                            </p>
                        </div>

                        {/* <div className="text-center">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple-100 mb-4">
                                <svg
                                    className="w-7 h-7 text-purple-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                    />
                                </svg>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                                Smart Recommendations
                            </h4>
                            <p className="text-gray-600 text-xs">
                                Find similar vehicles
                            </p>
                        </div> */}

                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-100 mb-4">
                                <svg
                                    className="w-7 h-7 text-orange-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                                    />
                                </svg>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                                Market Insights
                            </h4>
                            <p className="text-gray-600 text-xs">
                                Data-driven decisions
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
