"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import SurveyDisplay from "@/components/survey-display/SurveyDisplay";
import Sidebar from "@/components/dashboard/Sidebar";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useOptimization } from "@/hooks/useOptimization";
import { useSurveyManagement } from "@/hooks/useSurveyManagement";
import { SurveyCreator } from "@/components/dashboard/SurveyCreator";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SurveySkeleton from "@/components/survey-display/SurveySkeleton";

export default function DashboardPage() {
    const supabase = createClient();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSelectingSurvey, setIsSelectingSurvey] = useState(false);

    const { 
        survey,
        savedSurveys,
        isLoading,
        isRenamingTitle,
        isUpdatingDescription,
        error,
        fetchSurveys,
        selectSurvey,
        createSurvey,
        renameSurvey,
        updateDescription,
        deleteSurvey,
        clearSurvey
    } = useSurveyManagement();

    const { authStatus, handleGoogleAuth, handleConnect } = useGoogleAuth();
    const { status: optimizationStatus, isImporting, handleImport } = useOptimization(survey?.content ?? null, 'googleforms');

    // Reset isSelectingSurvey when survey loads
    useEffect(() => {
        if (!isLoading && isSelectingSurvey) {
            setIsSelectingSurvey(false);
        }
    }, [isLoading, isSelectingSurvey]);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/login");
            } else {
                fetchSurveys();
            }
        };
        checkUser();
    }, [supabase.auth, router, fetchSurveys]);

    const handleSelectSurvey = async (id: string) => {
        setIsSelectingSurvey(true);
        await selectSurvey(id);
    };

    const handleNewSurvey = () => {
        clearSurvey();
        setIsSidebarOpen(false);
    };

    const handleDeleteCurrentSurvey = async () => {
        if (!survey || !window.confirm('Are you sure you want to delete this survey?')) return;
        await deleteSurvey(survey.id);
        setIsSidebarOpen(false);
    };

    const handleGoogleFormsImport = async () => {
        try {
            const isAuthorized = await handleGoogleAuth();
            if (!isAuthorized) return;

            const result = await handleImport();
            if (result?.requiresAuth) {
                await handleGoogleAuth();
                return;
            }

            if (result?.url) {
                window.open(result.url, '_blank');
            }
        } catch (err) {
            console.error('Import error:', err);
        }
    };

    return (
        <div className="flex flex-row h-screen w-full bg-[#09090b] overflow-hidden">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                surveys={savedSurveys}
                onSelectSurvey={handleSelectSurvey}
                onNewSurvey={handleNewSurvey}
                onDeleteSurvey={deleteSurvey}
            />
            
            <main className="flex flex-col h-screen w-full overflow-auto relative">
                <DashboardHeader 
                    survey={survey}
                    onRenameSurvey={(newTitle) => survey ? renameSurvey(survey.id, newTitle) : Promise.resolve()}
                    onDeleteSurvey={handleDeleteCurrentSurvey}
                    onToggleSidebar={() => setIsSidebarOpen(true)}
                    isImporting={isImporting}
                    optimizationStatus={optimizationStatus}
                    authStatus={authStatus}
                    onGoogleFormsImport={handleGoogleFormsImport}
                    onConnect={handleConnect}
                />

                <div className="flex-1 flex px-4">
                    <div className="max-w-4xl w-full mx-auto py-8">
                        {!survey && !isSelectingSurvey ? (
                            <SurveyCreator
                                onSubmit={createSurvey}
                                isLoading={isLoading}
                                error={error}
                            />
                        ) : isSelectingSurvey || isLoading ? (
                            <SurveySkeleton />
                        ) : (
                            <div className="w-full">
                                <SurveyDisplay 
                                    survey={survey!.content} 
                                    onUpdateTitle={(newTitle) => survey ? renameSurvey(survey.id, newTitle) : Promise.resolve()}
                                    onUpdateDescription={(newDescription) => survey ? updateDescription(survey.id, newDescription) : Promise.resolve()}
                                    isRenamingTitle={isRenamingTitle}
                                    isUpdatingDescription={isUpdatingDescription}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
