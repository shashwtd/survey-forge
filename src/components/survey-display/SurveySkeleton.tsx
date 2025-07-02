export default function SurveySkeleton() {
    return (
        <div className="flex flex-col w-full gap-6 max-w-4xl pt-12 animate-pulse">
            {/* Survey Header Skeleton */}
            <div className="mb-4">
                <div className="h-10 w-3/4 bg-white/5 rounded-md mb-3"></div>
                <div className="h-6 w-1/2 bg-white/5 rounded-md"></div>
            </div>

            {/* Questions Skeleton - Show 3 questions */}
            {[1, 2, 3].map((index) => (
                <div key={index} className="bg-white/5 rounded-lg p-6 flex flex-col gap-4">
                    {/* Question Header */}
                    <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-white/10 rounded-full flex-shrink-0"></div>
                        <div className="flex-1">
                            <div className="h-6 w-3/4 bg-white/10 rounded-md mb-2"></div>
                            <div className="h-4 w-1/2 bg-white/10 rounded-md"></div>
                        </div>
                    </div>

                    {/* Question Content */}
                    <div className="pl-12">
                        {/* Answer options - Show 4 options */}
                        {[1, 2, 3, 4].map((optionIndex) => (
                            <div key={optionIndex} className="flex items-center gap-3 mb-3">
                                <div className="w-4 h-4 bg-white/10 rounded-full"></div>
                                <div className="h-4 w-2/3 bg-white/10 rounded-md"></div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Confirmation Message Skeleton */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="h-4 w-3/4 bg-white/10 rounded-md mx-auto"></div>
            </div>
        </div>
    );
}
