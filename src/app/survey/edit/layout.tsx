"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useOptimization } from "@/hooks/useOptimization";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useSurveyContext } from "@/context/SurveyContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function SurveyEditLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const params = useParams();

    const { 
        survey,
        selectSurvey,
        renameSurvey,
        deleteSurvey,
    } = useSurveyContext();

    const { status: optimizationStatus, isImporting, handleImport } = useOptimization(
        survey?.content ?? null,
        'googleforms'
    );

    const { authStatus, handleConnect } = useGoogleAuth();

    // Load survey only if we don't have it or if it's a different one
    useEffect(() => {
        if (!params.id) return;
        if (!survey || survey.id !== params.id) {
            selectSurvey(params.id as string);
        }
    }, [params.id, survey, selectSurvey]);

    const handleDeleteCurrentSurvey = async () => {
        if (!survey) return;
        if (window.confirm('Are you sure you want to delete this survey?')) {
            await deleteSurvey(survey.id);
            router.push('/dashboard');
        }
    };

    const handleGoogleFormsImport = async () => {
        try {
            const result = await handleImport();
            if (result?.requiresAuth) {
                handleConnect();
                return;
            }
            if (result?.url) {
                window.open(result.url, '_blank');
            }
        } catch (error) {
            console.error('Failed to import to Google Forms:', error);
            alert('Failed to export to Google Forms. Please try again.');
        }
    };

    return (
        <div className="flex flex-col h-screen w-full bg-[#09090b] overflow-hidden">
            <DashboardHeader 
                survey={survey}
                onRenameSurvey={(newTitle:string) => survey ? renameSurvey(survey.id, newTitle) : Promise.resolve()}
                onDeleteSurvey={handleDeleteCurrentSurvey}
                isImporting={isImporting}
                optimizationStatus={optimizationStatus}
                authStatus={authStatus}
                onGoogleFormsImport={handleGoogleFormsImport}
                onConnect={handleConnect}
            />
            {children}
        </div>
    );
}
