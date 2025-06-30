import { SurveyType } from "@/types/survey";
import QuestionComponent from "./QuestionComponent";

interface SurveyDisplayProps {
    survey: SurveyType;
}

export default function SurveyDisplay({ survey }: SurveyDisplayProps) {
    return (
        <div className="flex flex-col w-full gap-6 max-w-4xl">
            {/* Survey Header */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-2">{survey.title}</h2>
                <p className="text-white/60">{survey.description}</p>
            </div>

            {/* Questions */}
            {survey.questions.map((question, index) => (
                <QuestionComponent 
                    key={question.id}
                    question={question}
                    index={index}
                />
            ))}

            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-sm text-white/60 text-center">
                    {survey.settings?.confirmationMessage || "Thank you for taking the time to complete this survey. Your feedback is valuable to us."}
                </p>
            </div>
        </div>
    );
}
