"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useSurveyContext } from "@/context/SurveyContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

type ExportStatus = {
    status: 'idle' | 'exporting' | 'optimizing' | 'creating' | 'success' | 'error';
    message?: string;
};

export default function SurveyEditLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const params = useParams();
    const [exportStatus, setExportStatus] = useState<ExportStatus>({ status: 'idle' });

    const { 
        survey,
        isLoading,
        selectSurvey,
        renameSurvey,
        deleteSurvey,
    } = useSurveyContext();

    const { authStatus, handleConnect } = useGoogleAuth();
    
    useEffect(() => {
        if (!params.id || params.id === 'undefined') {
            router.replace('/survey/create?error=unknown_survey');
            return;
        }
        
        // Only fetch if we don't have the survey or it's a different one
        if (!survey || survey.id !== params.id) {
            selectSurvey(params.id as string).catch((error) => {
                console.error('Failed to load survey:', error);
                router.replace('/survey/create?error=unknown_survey');
            });
        }
    }, [params.id, survey, selectSurvey, router]);

    const handleDeleteCurrentSurvey = async () => {
        if (!survey) return;
        if (window.confirm('Are you sure you want to delete this survey?')) {
            await deleteSurvey(survey.id);
            router.push('/dashboard');
        }
    };

    const handleGoogleFormsExport = async (surveyId: string) => {
        try {
            // Start with initial status
            setExportStatus({ status: 'exporting', message: 'Starting export...' });

            // After 1 second, show optimizing message as this typically takes 2-3 seconds
            const optimizingTimeout = setTimeout(() => {
                setExportStatus({ status: 'optimizing', message: 'Optimizing survey format...' });
            }, 1000);

            // After 4 seconds, show creating form message as this typically takes 3-4 seconds
            const creatingTimeout = setTimeout(() => {
                setExportStatus({ status: 'creating', message: 'Creating Google Form...' });
            }, 4000);
            
            const response = await fetch('/api/survey/export/google-forms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ surveyId }),
            });

            // Clear timeouts as we got the response
            clearTimeout(optimizingTimeout);
            clearTimeout(creatingTimeout);

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 403 && data.requiresAuth) {
                    setExportStatus({ status: 'idle' });
                    handleConnect();
                    return;
                }
                throw new Error(data.error || 'Failed to export survey');
            }

            if (data.url) {
                setExportStatus({ status: 'success', message: 'Opening Google Forms...' });
                window.open(data.url, '_blank');
                // Reset status after a brief delay
                setTimeout(() => setExportStatus({ status: 'idle' }), 2000);
            }
        } catch (error) {
            console.error('Failed to export to Google Forms:', error);
            setExportStatus({ 
                status: 'error', 
                message: error instanceof Error ? error.message : 'Failed to export to Google Forms'
            });
            // Reset error status after 3 seconds
            setTimeout(() => setExportStatus({ status: 'idle' }), 3000);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#09090b]">
            <div className="sticky top-0 z-50">
                <DashboardHeader 
                    survey={survey}
                    onRenameSurvey={(newTitle:string) => survey ? renameSurvey(survey.id, newTitle) : Promise.resolve()}
                    onDeleteSurvey={handleDeleteCurrentSurvey}
                    exportStatus={exportStatus}
                    authStatus={authStatus}
                    onGoogleFormsExport={handleGoogleFormsExport}
                    onConnect={handleConnect}
                    isLoading={isLoading}
                />
            </div>
            {children}
        </div>
    );
}
