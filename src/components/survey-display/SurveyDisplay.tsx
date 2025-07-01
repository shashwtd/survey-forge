import { useState, useEffect } from "react";
import { SurveyType } from "@/types/survey";
import QuestionComponent from "./QuestionComponent";

interface SurveyDisplayProps {
    survey: SurveyType;
    onUpdateTitle?: (newTitle: string) => Promise<void>;
    isLoading?: boolean;
}

export default function SurveyDisplay({ survey, onUpdateTitle, isLoading = false }: SurveyDisplayProps) {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [titleInput, setTitleInput] = useState(survey.title);
    const [showSuccess, setShowSuccess] = useState(false);

    // Reset states when survey changes
    useEffect(() => {
        setTitleInput(survey.title);
        setIsEditingTitle(false);
        setShowSuccess(false);
    }, [survey.title]);

    const handleTitleUpdate = async (newTitle: string) => {
        if (!onUpdateTitle || newTitle === survey.title) {
            setIsEditingTitle(false);
            return;
        }

        setIsEditingTitle(false);

        try {
            await onUpdateTitle(newTitle);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
            }, 3000);
        } catch (error) {
            console.error("Error updating survey title:", error);
        }
    };

    const handleTitleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            await handleTitleUpdate(titleInput);
        } else if (e.key === 'Escape') {
            setTitleInput(survey.title);
            setIsEditingTitle(false);
        }
    };

    const handleTitleBlur = async () => {
        await handleTitleUpdate(titleInput);
    };

    return (
        <div className="flex flex-col w-full gap-6 max-w-4xl pt-12">
            {/* Survey Header */}
            <div className="mb-4">
                <div className="group relative inline-block">
                    {isEditingTitle ? (
                        <input
                            type="text"
                            value={titleInput}
                            onChange={(e) => setTitleInput(e.target.value)}
                            onKeyDown={handleTitleKeyDown}
                            onBlur={handleTitleBlur}
                            className="w-full px-3 py-2 text-3xl font-bold font-instrument-sans bg-white/5 border border-white/20 rounded-md text-neutral-100 outline-none focus:border-white/40 focus:bg-white/10 transition-all"
                            placeholder="Enter survey title..."
                            autoFocus
                        />
                    ) : (
                        <div 
                            onClick={() => onUpdateTitle && !isLoading && setIsEditingTitle(true)}
                            className="flex items-center"
                        >
                            <h1 className="text-3xl font-bold text-neutral-100 mb-3 font-instrument-sans">{survey.title}</h1>
                            <div className="flex items-center ml-3">
                                {isLoading ? (
                                    // Spinner icon
                                    <div className="w-5 h-5 relative flex items-center">
                                        <div className="absolute w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
                                    </div>
                                ) : showSuccess ? (
                                    // Success icon
                                    <svg 
                                        viewBox="0 0 24 24" 
                                        className="w-5 h-5 text-green-500"
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2"
                                    >
                                        <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                ) : onUpdateTitle && (
                                    // Edit icon
                                    <svg 
                                        viewBox="0 0 24 24" 
                                        className={`w-5 h-5 opacity-0 ${!isLoading && !showSuccess ? 'group-hover:opacity-100' : ''} text-white/40 hover:text-white cursor-pointer`}
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2"
                                    >
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <p className="text-lg text-neutral-400 max-w-2xl">{survey.description}</p>
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
