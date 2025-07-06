import { type SurveyQuestion } from "@/types/survey";
import { QuestionHeader } from "./question-types/QuestionHeader";
import { MultipleChoiceQuestion } from "./question-types/MultipleChoiceQuestion";
import { CheckboxQuestion } from "./question-types/CheckboxQuestion";
import { TextQuestion } from "./question-types/TextQuestion";
import { ParagraphQuestion } from "./question-types/ParagraphQuestion";
import { RatingQuestion } from "./question-types/RatingQuestion";
import { DropdownQuestion } from "./question-types/DropdownQuestion";
import { DateQuestion } from "./question-types/DateQuestion";
import { TimeQuestion } from "./question-types/TimeQuestion";
import { EmailQuestion } from "./question-types/EmailQuestion";
import { NumberQuestion } from "./question-types/NumberQuestion";
import { SectionQuestion } from "./question-types/SectionQuestion";

interface QuestionComponentProps {
    question: SurveyQuestion;
    index: number;
}

export default function QuestionComponent({
    question,
    index,
}: QuestionComponentProps) {
    const renderQuestionInput = () => {
        switch (question.type) {
            case "multiple_choice":
                return <MultipleChoiceQuestion question={question} />;
            case "checkbox":
                return <CheckboxQuestion question={question} />;
            case "text":
                return <TextQuestion question={question} />;
            case "paragraph":
                return <ParagraphQuestion question={question} />;
            case "rating":
                return <RatingQuestion question={question} />;
            case "dropdown":
                return <DropdownQuestion question={question} />;
            case "date":
                return <DateQuestion question={question} />;
            case "time":
                return <TimeQuestion question={question} />;
            case "email":
                return <EmailQuestion question={question} />;
            case "number":
                return <NumberQuestion question={question} />;
            case "section":
                return <SectionQuestion question={question} />;
            default:
                return null;
        }
    };

    return (
        <div
            key={question.id}
            className="bg-white/5 border border-white/10 rounded-lg p-6"
        >
            <div className="flex flex-row gap-6">
                {/* Question Number Column */}
                <div className="flex flex-col items-center">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#444141] to-[#2c2c2e] flex items-center justify-center text-sm font-medium text-white shadow-lg">
                        {question.type !== "section" ? index + 1 : "▢"}
                    </div>
                    <div className="w-px flex-1 bg-white/10 mt-3"></div>
                </div>

                {/* Question Content Column */}
                <div className="w-full">
                    {question.type !== "section" && (
                        <QuestionHeader
                            question={question.question}
                            description={question.description}
                            required={question.required}
                        />
                    )}
                    <div className="pl-0">{renderQuestionInput()}</div>
                </div>
            </div>
        </div>
    );
}
