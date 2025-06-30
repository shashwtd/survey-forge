import { type SurveyQuestion } from "@/types/survey";

interface ParagraphQuestionProps {
    question: SurveyQuestion;
}

export function ParagraphQuestion({ question }: ParagraphQuestionProps) {
    return (
        <textarea
            name={question.id}
            required={question.required}
            rows={4}
            placeholder="Enter your detailed answer..."
            className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm text-white 
                placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#3f4da8] focus:border-transparent 
                resize-vertical hover:bg-white/10 transition-colors cursor-text"
        />
    );
}