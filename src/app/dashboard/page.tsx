"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { SurveyType } from "@/types/survey";
import SurveyDisplay from "@/components/survey-display/SurveyDisplay";
import { Menu } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useOptimization } from "@/hooks/useOptimization";
import { SurveyCreator } from "@/components/SurveyCreator";

export default function DashboardPage() {
    const supabase = createClient();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [survey, setSurvey] = useState<SurveyType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [savedSurveys, setSavedSurveys] = useState<Array<{
        id: string;
        title: string;
        created_at: string;
    }>>([]);

    const { authStatus, error: authError, handleGoogleAuth, handleConnect } = useGoogleAuth();
    const { status: optimizationStatus, isImporting, handleImport } = useOptimization(survey, 'googleforms');

    const fetchSurveys = async () => {
        try {
            const response = await fetch('/api/survey/list');
            if (!response.ok) {
                throw new Error('Failed to fetch surveys');
            }
            const data = await response.json();
            setSavedSurveys(data);
        } catch (error) {
            console.error('Error fetching surveys:', error);
        }
    };

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
    }, [supabase.auth, router]);

    const handleSelectSurvey = async (id: string) => {
        try {
            const response = await fetch(`/api/survey/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch survey');
            }
            const data = await response.json();
            setSurvey(data.content);
            setIsSidebarOpen(false);
        } catch (error) {
            console.error('Error fetching survey:', error);
        }
    };

    const handleNewSurvey = () => {
        setSurvey(null);
        setIsSidebarOpen(false);
    };

    const handleDeleteSurvey = async (id: string) => {
        try {
            const response = await fetch(`/api/survey/${id}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete survey');
            }
            
            await fetchSurveys();
        } catch (error) {
            console.error('Error deleting survey:', error);
        }
    };

    const handleSubmit = async (content: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/survey/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });

            const data = await response.json();

            if (!response.ok) {
                let errorMessage = data.error || 'Failed to generate survey';

                if (data.code === 'SERVICE_OVERLOADED') {
                    errorMessage = 'The AI service is temporarily overloaded. Please try again in a few minutes.';
                } else if (data.code === 'PARSE_ERROR') {
                    errorMessage = 'The AI generated an invalid response. Please try again or rephrase your content.';
                } else if (data.code === 'INVALID_RESPONSE' || data.code === 'INVALID_QUESTION' || data.code === 'INVALID_OPTIONS') {
                    errorMessage = 'The generated survey was invalid. Please try again or provide more detailed content.';
                }

                throw new Error(errorMessage);
            }

            setSurvey(data);
            await fetchSurveys();
        } catch (err) {
            const error = err as Error;
            setError(error.message);
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
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
            setError('Failed to import survey. Please try again.');
        }
    };

    return (
        <div className="flex flex-row h-screen w-full bg-neutral-950/50 overflow-hidden">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                surveys={savedSurveys}
                onSelectSurvey={handleSelectSurvey}
                onNewSurvey={handleNewSurvey}
                onDeleteSurvey={handleDeleteSurvey}
            />
            
            <main className="flex flex-col h-screen w-full overflow-auto">
                <div className="flex items-center lg:hidden h-16 px-4 border-b border-white/10">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-white/60 hover:text-white"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                <div className="flex-1 flex px-4">
                    <div className="max-w-4xl w-full mx-auto py-8">
                        {!survey ? (
                            <SurveyCreator
                                onSubmit={handleSubmit}
                                isLoading={isLoading}
                                error={error}
                            />
                        ) : (
                            <div className="w-full">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-white font-instrument-sans">Generated Survey</h2>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                setSurvey(null);
                                                fetchSurveys();
                                            }}
                                            className="px-4 py-2 text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-md border border-white/10 transition-colors"
                                        >
                                            Create New
                                        </button>
                                        <button
                                            onClick={() => handleSubmit(JSON.stringify(survey))}
                                            className="px-4 py-2 text-white bg-[#3f4da8] hover:bg-[#3f4da8]/90 rounded-md transition-colors"
                                        >
                                            Regenerate
                                        </button>
                                    </div>
                                </div>

                                <SurveyDisplay survey={survey} />

                                <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-3 h-3 rounded-full ${
                                                optimizationStatus === 'optimizing' ? 'bg-yellow-400 animate-pulse' :
                                                optimizationStatus === 'ready' ? 'bg-green-400' :
                                                optimizationStatus === 'error' ? 'bg-red-400' :
                                                'bg-gray-400'
                                            }`} />
                                            <span className="text-white/80">
                                                {optimizationStatus === 'optimizing' ? 'Optimizing for Google Forms' :
                                                 optimizationStatus === 'ready' ? 'Ready to import to Google Forms' :
                                                 optimizationStatus === 'error' ? 'Error optimizing for Google Forms' :
                                                 'Select platform:'}
                                            </span>
                                        </div>
                                    </div>

                                    {optimizationStatus === 'ready' && (
                                        <div className="mt-4">
                                            {authStatus === 'success' ? (
                                                <button
                                                    onClick={handleGoogleFormsImport}
                                                    disabled={isImporting}
                                                    className="px-4 py-2 bg-[#3f4da8] text-white rounded-md hover:bg-[#3f4da8]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isImporting ? 'Importing...' : 'Import to Google Forms'}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleConnect}
                                                    className="px-4 py-2 bg-[#3f4da8] text-white rounded-md hover:bg-[#3f4da8]/90 transition-colors"
                                                >
                                                    Connect Google Account
                                                </button>
                                            )}
                                            {authStatus === 'error' && authError && (
                                                <p className="mt-2 text-sm text-red-400">{authError}</p>
                                            )}
                                        </div>
                                    )}

                                    {optimizationStatus === 'error' && (
                                        <p className="mt-4 text-red-400">
                                            Failed to optimize survey for Google Forms. Please try again.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
