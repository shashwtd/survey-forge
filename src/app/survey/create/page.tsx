"use client";

import { useRouter } from "next/navigation";
import { SurveyCreator } from "@/components/dashboard/SurveyCreator";
import { useSurveyContext } from "@/context/SurveyContext";

export default function CreateSurveyPage() {
    const router = useRouter();
    const { isLoading, error, createSurvey } = useSurveyContext();

    const handleCreateSurvey = async (content: string) => {
        try {
            const newSurvey = await createSurvey(content);
            // After creating the survey, redirect to the edit page
            router.push(`/survey/edit/${newSurvey.id}`);
        } catch (err) {
            console.error('Error creating survey:', err);
        }
    };

    return (
        <div className="flex-1 flex px-4">
            <div className="max-w-4xl w-full mx-auto py-8">
                <SurveyCreator
                    onSubmit={handleCreateSurvey}
                    isLoading={isLoading}
                    error={error}
                />
            </div>
        </div>
    );
}
