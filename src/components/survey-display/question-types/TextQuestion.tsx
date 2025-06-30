import { type SurveyQuestion } from "@/types/survey";

interface TextQuestionProps {
    question: SurveyQuestion;
}

export function TextQuestion({ question }: TextQuestionProps) {
    return (
        <input
            type="text"
            name={question.id}
            required={question.required}
            placeholder="Enter your answer..."
            className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm text-white 
                placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#3f4da8] focus:border-transparent
                hover:bg-white/10 transition-colors cursor-text"
        />
    );
}