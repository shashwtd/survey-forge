import { type SurveyQuestion } from "@/types/survey";

interface DropdownQuestionProps {
    question: SurveyQuestion;
}

export function DropdownQuestion({ question }: DropdownQuestionProps) {
    return (
        <select
            name={question.id}
            required={question.required}
            className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm text-white 
                focus:outline-none focus:ring-2 focus:ring-[#3f4da8] focus:border-transparent
                cursor-pointer hover:bg-white/10 transition-colors appearance-none"
            style={{ 
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1em'
            }}
        >
            <option value="" className="bg-gray-800">Select an option...</option>
            {question.options?.map((option, idx) => (
                <option key={idx} value={option} className="bg-gray-800">
                    {option}
                </option>
            ))}
        </select>
    );
}