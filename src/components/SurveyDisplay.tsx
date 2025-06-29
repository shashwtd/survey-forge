import { SurveyType } from "@/types/survey";

interface SurveyDisplayProps {
    survey: SurveyType;
}

export default function SurveyDisplay({ survey }: SurveyDisplayProps) {
    return (
        <div className="flex flex-col w-full gap-6">
            {/* Survey Header */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-2">{survey.title}</h2>
                <p className="text-white/60">{survey.description}</p>
            </div>

            {/* Questions */}
            {survey.questions.map((question, index) => (
                <div key={question.id} className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <div className="flex flex-row gap-6">
                        {/* Question Number Column */}
                        <div className="flex flex-col items-center">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#444141] to-[#2c2c2e] flex items-center justify-center text-sm font-medium text-white shadow-lg">
                                {index + 1}
                            </div>
                            <div className="w-px flex-1 bg-white/10 mt-3"></div>
                        </div>

                        {/* Question Content Column */}
                        <div className="w-full">
                            {/* Question Header */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                                    {question.question}
                                    {question.required && (
                                        <span className="text-red-500 text-base relative group cursor-help">*
                                            <span className="invisible group-hover:visible absolute left-full ml-2 whitespace-nowrap bg-red-500/10 text-red-500 px-2 py-1 rounded text-xs">
                                                Required field
                                            </span>
                                        </span>
                                    )}
                                </h3>
                                {question.description && (
                                    <p className="text-sm text-white/60 mt-1">{question.description}</p>
                                )}
                            </div>

                            {/* Question Input */}
                            <div className="pl-0">
                                {/* Rating - New Design */}
                                {question.type === 'rating' && (
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
                                )}

                                {/* Multiple Choice */}
                                {question.type === 'multiple_choice' && question.options && (
                                    <div className="space-y-3">
                                        {question.options.map((option, idx) => (
                                            <label key={idx} className="flex items-center group cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name={question.id}
                                                    required={question.required}
                                                    className="h-4 w-4 border border-white/15 bg-white/5 text-[#3f4da8] focus:ring-[#3f4da8] rounded-full"
                                                />
                                                <span className="ml-3 text-sm text-white/80 group-hover:text-white transition-colors">
                                                    {option}
                                                </span>
                                            </label>
                                        ))}
                                        {question.settings?.allowOther && (
                                            <label className="flex items-center group cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name={question.id}
                                                    className="h-4 w-4 border border-white/15 bg-white/5 text-[#3f4da8] focus:ring-[#3f4da8] rounded-full"
                                                />
                                                <span className="ml-3 text-sm text-white/80 group-hover:text-white transition-colors flex items-center gap-2">
                                                    Other:
                                                    <input
                                                        type="text"
                                                        className="rounded-md border border-white/15 bg-white/5 px-3 py-1 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#3f4da8] focus:border-transparent"
                                                        placeholder="Specify other..."
                                                    />
                                                </span>
                                            </label>
                                        )}
                                    </div>
                                )}

                                {/* Checkbox */}
                                {question.type === 'checkbox' && question.options && (
                                    <div className="space-y-3">
                                        {question.options.map((option, idx) => (
                                            <label key={idx} className="flex items-center group cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    required={question.required}
                                                    className="h-4 w-4 border border-white/15 bg-white/5 text-[#3f4da8] focus:ring-[#3f4da8] rounded"
                                                />
                                                <span className="ml-3 text-sm text-white/80 group-hover:text-white transition-colors">
                                                    {option}
                                                </span>
                                            </label>
                                        ))}
                                        {question.settings?.allowOther && (
                                            <label className="flex items-center group cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 border border-white/15 bg-white/5 text-[#3f4da8] focus:ring-[#3f4da8] rounded"
                                                />
                                                <span className="ml-3 text-sm text-white/80 group-hover:text-white transition-colors flex items-center gap-2">
                                                    Other:
                                                    <input
                                                        type="text"
                                                        className="rounded-md border border-white/15 bg-white/5 px-3 py-1 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#3f4da8] focus:border-transparent"
                                                        placeholder="Specify other..."
                                                    />
                                                </span>
                                            </label>
                                        )}
                                    </div>
                                )}

                                {/* Text Input */}
                                {question.type === 'text' && (
                                    <input
                                        type="text"
                                        required={question.required}
                                        placeholder="Enter your answer..."
                                        className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#3f4da8] focus:border-transparent"
                                    />
                                )}

                                {/* Paragraph */}
                                {question.type === 'paragraph' && (
                                    <textarea
                                        required={question.required}
                                        rows={4}
                                        placeholder="Enter your detailed answer..."
                                        className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#3f4da8] focus:border-transparent resize-vertical"
                                    />
                                )}

                                {/* Dropdown */}
                                {question.type === 'dropdown' && question.options && (
                                    <select
                                        required={question.required}
                                        className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm text-white 
                                            focus:outline-none focus:ring-2 focus:ring-[#3f4da8] focus:border-transparent
                                            cursor-pointer hover:bg-white/10 transition-colors"
                                    >
                                        <option value="" className="bg-gray-800">Select an option...</option>
                                        {question.options.map((option, idx) => (
                                            <option key={idx} value={option} className="bg-gray-800">
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                )}

                                {/* Date */}
                                {question.type === 'date' && (
                                    <input
                                        type="date"
                                        required={question.required}
                                        className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#3f4da8] focus:border-transparent"
                                    />
                                )}

                                {/* Time */}
                                {question.type === 'time' && (
                                    <input
                                        type="time"
                                        required={question.required}
                                        className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#3f4da8] focus:border-transparent"
                                    />
                                )}

                                {/* Email */}
                                {question.type === 'email' && (
                                    <input
                                        type="email"
                                        required={question.required}
                                        placeholder="Enter your email..."
                                        className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#3f4da8] focus:border-transparent"
                                    />
                                )}

                                {/* Number */}
                                {question.type === 'number' && (
                                    <input
                                        type="number"
                                        required={question.required}
                                        placeholder="Enter a number..."
                                        min={question.settings?.validation?.min}
                                        max={question.settings?.validation?.max}
                                        className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#3f4da8] focus:border-transparent"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-sm text-white/60 text-center">
                    {survey.settings?.confirmationMessage || "Thank you for taking the time to complete this survey. Your feedback is valuable to us."}
                </p>
            </div>
        </div>
    );
}
