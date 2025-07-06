import { type SurveyQuestion } from "@/types/survey";

interface SectionQuestionProps {
    question: SurveyQuestion;
}

export function SectionQuestion({ question }: SectionQuestionProps) {
    return (
        <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">{question.question}</h2>
            {question.description && (
                <p className="text-neutral-400">{question.description}</p>
            )}
        </div>
    );
}
