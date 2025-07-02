"use client";

import { useRouter } from "next/navigation";
import { SurveyCreator } from "@/components/dashboard/SurveyCreator";
import { useSurveyManagement } from "@/hooks/useSurveyManagement";

export default function CreateSurveyPage() {
    const router = useRouter();
    const { isLoading, error, createSurvey } = useSurveyManagement();

    const handleCreateSurvey = async (content: string) => {
        try {
            await createSurvey(content);
            // After creating the survey, redirect to the dashboard
            // The survey will be visible in the sidebar
            router.push('/dashboard');
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
