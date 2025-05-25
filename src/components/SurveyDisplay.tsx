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
        <div className="w-full max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-lg p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">{survey.title}</h2>
                <p className="text-white/60">{survey.description}</p>
            </div>

            <div className="space-y-6">
                {survey.questions.map((question) => (
                    <div key={question.id} className="border border-white/10 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-white mb-4">{question.question}</h3>

                        {question.type === 'multiple_choice' && question.options && (
                            <div className="space-y-2">
                                {question.options.map((option, index) => (
                                    <div key={index} className="flex items-center">
                                        <input
                                            type="radio"
                                            name={question.id}
                                            id={`${question.id}-${index}`}
                                            className="h-4 w-4 border-white/10 bg-white/5 text-[#3f4da8] focus:ring-[#3f4da8]"
                                        />
                                        <label
                                            htmlFor={`${question.id}-${index}`}
                                            className="ml-3 text-sm font-medium text-white"
                                        >
                                            {option}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}

                        {question.type === 'text' && (
                            <textarea
                                className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#3f4da8] focus:border-transparent"
                                rows={3}
                                placeholder="Enter your answer..."
                            />
                        )}

                        {question.type === 'rating' && (
                            <div className="flex gap-4">
                                {[1, 2, 3, 4, 5].map((value) => (
                                    <button
                                        key={value}
                                        className="h-10 w-10 rounded-full border border-white/15 bg-white/5 text-white hover:bg-[#3f4da8]/20 focus:outline-none focus:ring-2 focus:ring-[#3f4da8] focus:border-transparent"
                                    >
                                        {value}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
