import { type SurveyQuestion } from "@/types/survey";

interface RatingQuestionProps {
    question: SurveyQuestion;
}

export function RatingQuestion({ question }: RatingQuestionProps) {
    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-center gap-4">
                <span className="text-sm text-white/80 font-medium min-w-[120px]">
                    {question.settings?.ratingLabels?.min || 'Very Dissatisfied'}
                </span>
                
                <div className="flex-1 flex items-center justify-center relative py-4">
                    {/* Background line */}
                    <div className="absolute top-1/2 h-0.5 w-[calc(100%-1rem)] bg-white/10 left-1/2 -translate-x-1/2"></div>
                    
                    {/* Rating buttons */}
                    <div className="flex justify-between w-full relative">
                        {Array.from({ length: (question.settings?.maxRating || 5) - (question.settings?.minRating || 1) + 1 }).map((_, idx) => {
                            const value = (question.settings?.minRating || 1) + idx;
                            return (
                                <label key={value} className="relative">
                                    <input
                                        type="radio"
                                        name={question.id}
                                        value={value}
                                        required={question.required}
                                        className="sr-only peer"
                                    />
                                    <div className="w-8 h-8 rounded-full border-2 border-white/15 bg-[#1a1a1a] 
                                        flex items-center justify-center text-sm font-medium text-white/80
                                        hover:border-[#3f4da8] hover:bg-[#3f4da8]/10 cursor-pointer transition-all
                                        peer-checked:bg-[#3f4da8] peer-checked:border-[#3f4da8] peer-checked:text-white
                                        peer-focus:ring-2 peer-focus:ring-[#3f4da8] peer-focus:ring-offset-2 peer-focus:ring-offset-[#1a1a1a]
                                        relative z-10">
                                        {value}
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </div>

                <span className="text-sm text-white/80 font-medium min-w-[120px] text-right">
                    {question.settings?.ratingLabels?.max || 'Very Satisfied'}
                </span>
            </div>
        </div>
    );
}