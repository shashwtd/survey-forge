import { type SurveyQuestion } from "@/types/survey";

interface NumberQuestionProps {
    question: SurveyQuestion;
}

export function NumberQuestion({ question }: NumberQuestionProps) {
    return (
        <input
            type="number"
            name={question.id}
            required={question.required}
            placeholder="Enter a number..."
            min={question.settings?.validation?.min}
            max={question.settings?.validation?.max}
            className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm text-white 
                placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#3f4da8] focus:border-transparent
                hover:bg-white/10 transition-colors cursor-text
                [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
    );
}