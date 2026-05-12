export const LoadingSkeleton = () => {
    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-300 overflow-hidden">
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-300 flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-5 w-40 bg-gray-300 rounded-md animate-pulse" />
                    <div className="h-3 w-24 bg-gray-200 rounded-md animate-pulse" />
                </div>
                <div className="h-4 w-14 bg-gray-200 rounded-md animate-pulse" />
            </div>

            <div className="divide-y divide-gray-100">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3"
                    >
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 bg-gray-300 rounded-lg animate-pulse" />
                            <div className="space-y-2">
                                <div
                                    className="h-4 bg-gray-300 rounded-md animate-pulse"
                                    style={{
                                        width: `${110 + (i % 3) * 24}px`,
                                    }}
                                />
                                <div className="h-3 w-20 bg-gray-200 rounded-md animate-pulse" />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <div className="space-y-1.5 text-right">
                                <div className="h-4 w-28 bg-gray-300 rounded-md animate-pulse" />
                            </div>
                            <div className="w-7 h-7 rounded-full bg-gray-200 animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
