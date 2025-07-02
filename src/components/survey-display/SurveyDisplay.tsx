import { useState, useEffect } from "react";
import { SurveyType } from "@/types/survey";
import QuestionComponent from "./QuestionComponent";

interface SurveyDisplayProps {
    survey: SurveyType;
    onUpdateTitle?: (newTitle: string) => Promise<void>;
    onUpdateDescription?: (newDescription: string) => Promise<void>;
    isRenamingTitle?: boolean;
    isUpdatingDescription?: boolean;
}

export default function SurveyDisplay({ 
    survey, 
    onUpdateTitle, 
    onUpdateDescription,
    isRenamingTitle = false,
    isUpdatingDescription = false 
}: SurveyDisplayProps) {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [titleInput, setTitleInput] = useState(survey.title);
    const [descriptionInput, setDescriptionInput] = useState(survey.description);
    const [showTitleSuccess, setShowTitleSuccess] = useState(false);
    const [showDescriptionSuccess, setShowDescriptionSuccess] = useState(false);

    // Reset states when survey changes
    useEffect(() => {
        setTitleInput(survey.title);
        setDescriptionInput(survey.description);
        setIsEditingTitle(false);
        setIsEditingDescription(false);
        setShowTitleSuccess(false);
        setShowDescriptionSuccess(false);
    }, [survey.title, survey.description]);

    const handleTitleUpdate = async (newTitle: string) => {
        if (!onUpdateTitle || newTitle === survey.title) {
            setIsEditingTitle(false);
            return;
        }

        setIsEditingTitle(false);

        try {
            await onUpdateTitle(newTitle);
            setShowTitleSuccess(true);
            setTimeout(() => {
                setShowTitleSuccess(false);
            }, 3000);
        } catch (error) {
            console.error("Error updating survey title:", error);
        }
    };

    const handleDescriptionUpdate = async (newDescription: string) => {
        if (!onUpdateDescription || newDescription === survey.description) {
            setIsEditingDescription(false);
            return;
        }

        setIsEditingDescription(false);

        try {
            await onUpdateDescription(newDescription);
            setShowDescriptionSuccess(true);
            setTimeout(() => {
                setShowDescriptionSuccess(false);
            }, 3000);
        } catch (error) {
            console.error("Error updating survey description:", error);
        }
    };

    // No longer needed as we have explicit save/cancel buttons

    return (
        <div className="flex flex-col w-full gap-6 max-w-4xl pt-12">
            {/* Survey Header */}
            <div className="mb-4">
                <div className="space-y-4">
                    {/* Title Section */}
                    <div className="group relative inline-block">                    {isEditingTitle ? (
                        <div className="space-y-3">
                            <input
                                type="text"
                                value={titleInput}
                                onChange={(e) => setTitleInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') {
                                        setTitleInput(survey.title);
                                        setIsEditingTitle(false);
                                    }
                                }}
                                className="w-full px-3 py-2 text-3xl font-bold font-instrument-sans bg-white/5 border border-white/20 rounded-md text-neutral-100 outline-none focus:border-white/40 focus:bg-white/10 transition-all"
                                placeholder="Enter survey title..."
                                autoFocus
                            />
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleTitleUpdate(titleInput)}
                                    disabled={isRenamingTitle}
                                    className="px-3 py-1.5 text-sm font-medium text-white bg-[#3f4da8] rounded hover:bg-[#3f4da8]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isRenamingTitle ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                    onClick={() => {
                                        setTitleInput(survey.title);
                                        setIsEditingTitle(false);
                                    }}
                                    disabled={isRenamingTitle}
                                    className="px-3 py-1.5 text-sm font-medium text-white/60 hover:text-white bg-white/5 rounded hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                            <div 
                                onClick={() => onUpdateTitle && !isRenamingTitle && setIsEditingTitle(true)}
                                className="flex items-center"
                            >
                                <h1 className="text-3xl font-bold text-neutral-100 mb-3 font-instrument-sans">{survey.title}</h1>
                                <div className="flex items-center ml-3">
                                    {isRenamingTitle ? (
                                        // Spinner icon
                                        <div className="w-5 h-5 relative flex items-center">
                                            <div className="absolute w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
                                        </div>
                                    ) : showTitleSuccess ? (
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
                                            className={`w-5 h-5 opacity-0 ${!isRenamingTitle && !showTitleSuccess ? 'group-hover:opacity-100' : ''} text-white/40 hover:text-white cursor-pointer`}
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

                    {/* Description Section */}
                    <div className="group relative">
                        {isEditingDescription ? (
                            <div className="space-y-3">
                                <textarea
                                    value={descriptionInput}
                                    onChange={(e) => setDescriptionInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Escape') {
                                            setDescriptionInput(survey.description);
                                            setIsEditingDescription(false);
                                        }
                                    }}
                                    className="w-full px-3 py-2 text-lg bg-white/5 border border-white/20 rounded-md text-neutral-400 outline-none focus:border-white/40 focus:bg-white/10 transition-all min-h-[100px] resize-y"
                                    placeholder="Enter survey description..."
                                    autoFocus
                                />
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleDescriptionUpdate(descriptionInput)}
                                        disabled={isUpdatingDescription}
                                        className="px-3 py-1.5 text-sm font-medium text-white bg-[#3f4da8] rounded hover:bg-[#3f4da8]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isUpdatingDescription ? 'Saving...' : 'Save'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setDescriptionInput(survey.description);
                                            setIsEditingDescription(false);
                                        }}
                                        disabled={isUpdatingDescription}
                                        className="px-3 py-1.5 text-sm font-medium text-white/60 hover:text-white bg-white/5 rounded hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div 
                                onClick={() => onUpdateDescription && !isUpdatingDescription && setIsEditingDescription(true)}
                                className="flex items-start gap-3 cursor-text"
                            >
                                <p className="text-lg text-neutral-400 max-w-2xl">{survey.description}</p>
                                <div className="flex items-center mt-1">
                                    {isUpdatingDescription ? (
                                        // Spinner icon
                                        <div className="w-4 h-4 relative flex items-center">
                                            <div className="absolute w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
                                        </div>
                                    ) : showDescriptionSuccess ? (
                                        // Success icon
                                        <svg 
                                            viewBox="0 0 24 24" 
                                            className="w-4 h-4 text-green-500"
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2"
                                        >
                                            <path d="M20 6L9 17l-5-5" />
                                        </svg>
                                    ) : onUpdateDescription && (
                                        // Edit icon
                                        <svg 
                                            viewBox="0 0 24 24" 
                                            className={`w-4 h-4 opacity-0 ${!isUpdatingDescription && !showDescriptionSuccess ? 'group-hover:opacity-100' : ''} text-white/40 hover:text-white cursor-pointer`}
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
                </div>
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
