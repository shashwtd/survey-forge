import { type SurveyQuestion } from "@/types/survey";

interface CheckboxQuestionProps {
    question: SurveyQuestion;
}

export function CheckboxQuestion({ question }: CheckboxQuestionProps) {
    return (
        <div className="space-y-3">
            {question.options?.map((option, idx) => (
                <label key={idx} className="flex items-center group cursor-pointer">
                    <input
                        type="checkbox"
                        name={question.id}
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
                        name={`${question.id}_other`}
                        className="h-4 w-4 border border-white/15 bg-white/5 text-[#3f4da8] focus:ring-[#3f4da8] rounded"
                    />
                    <span className="ml-3 text-sm text-white/80 group-hover:text-white transition-colors flex items-center gap-2">
                        Other:
                        <input
                            type="text"
                            name={`${question.id}_other_text`}
                            className="rounded-md border border-white/15 bg-white/5 px-3 py-1 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#3f4da8] focus:border-transparent"
                            placeholder="Specify other..."
                        />
                    </span>
                </label>
            )}
        </div>
    );
}