import { type SurveyQuestion } from "@/types/survey";

interface DateQuestionProps {
    question: SurveyQuestion;
}

export function DateQuestion({ question }: DateQuestionProps) {
    return (
        <input
            type="date"
            name={question.id}
            required={question.required}
            className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm text-white 
                focus:outline-none focus:ring-2 focus:ring-[#3f4da8] focus:border-transparent
                hover:bg-white/10 transition-colors cursor-pointer
                [color-scheme:dark]"
        />
    );
}