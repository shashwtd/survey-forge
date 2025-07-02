"use client";

import SurveyDisplay from "@/components/survey-display/SurveyDisplay";
import SurveySkeleton from "@/components/survey-display/SurveySkeleton";
import { useSurveyContext } from "@/context/SurveyContext";

export default function EditSurveyPage() {
    const { 
        survey,
        isLoading,
        isRenamingTitle,
        isUpdatingDescription,
        error,
        renameSurvey,
        updateDescription,
    } = useSurveyContext();

    return (
        <div className="flex-1 flex px-4">
            <div className="max-w-4xl w-full mx-auto py-8">
                {isLoading ? (
                    <SurveySkeleton />
                ) : error ? (
                    <div className="text-red-500 text-center">
                        {error}
                    </div>
                ) : survey ? (
                    <div className="w-full">
                        <SurveyDisplay 
                            survey={survey.content} 
                            onUpdateTitle={(newTitle: string) => survey ? renameSurvey(survey.id, newTitle) : Promise.resolve()}
                            onUpdateDescription={(newDescription: string) => survey ? updateDescription(survey.id, newDescription) : Promise.resolve()}
                            isRenamingTitle={isRenamingTitle}
                            isUpdatingDescription={isUpdatingDescription}
                        />
                    </div>
                ) : null}
            </div>
        </div>
    );
}
