interface SurveyQuestion {
    id: string;
    question: string;
    type: 'multiple_choice' | 'text' | 'rating';
    options?: string[];
}

interface Survey {
    title: string;
    description: string;
    questions: SurveyQuestion[];
}

interface SurveyDisplayProps {
    survey: Survey;
}

export default function SurveyDisplay({ survey }: SurveyDisplayProps) {
    return (
        <div className="flex flex-col w-full gap-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-2">{survey.title}</h2>
                <p className="text-white/60">{survey.description}</p>
            </div>

            {survey.questions.map((question, index) => (
                <div key={question.id} className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-white mb-4">
                        {index + 1}. {question.question}
                    </h3>

                    {question.type === 'multiple_choice' && question.options && (
                        <div className="space-y-3">
                            {question.options.map((option, idx) => (
                                <label key={idx} className="flex items-center group cursor-pointer">
                                    <input
                                        type="radio"
                                        name={question.id}
                                        className="h-4 w-4 border border-white/15 bg-white/5 text-[#3f4da8] focus:ring-[#3f4da8] rounded-full"
                                    />
                                    <span className="ml-3 text-sm text-white/80 group-hover:text-white transition-colors">
                                        {option}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}

                    {question.type === 'text' && (
                        <textarea
                            rows={3}
                            placeholder="Enter your answer..."
                            className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#3f4da8] focus:border-transparent resize-none"
                        />
                    )}

                    {question.type === 'rating' && (
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <button
                                    key={value}
                                    className="h-10 w-10 rounded-md border border-white/15 bg-white/5 text-white/80 hover:text-white hover:bg-[#3f4da8]/20 focus:outline-none focus:ring-2 focus:ring-[#3f4da8] focus:border-transparent transition-colors"
                                >
                                    {value}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ))}

            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-sm text-white/60 text-center">
                    Thank you for taking the time to complete this survey. Your feedback is valuable to us.
                </p>
            </div>
        </div>
    );
}
