"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { SurveyType } from "@/types/survey";
import { optimizeSurvey } from "@/services/optimzeSurvey";
import SurveyDisplay from "@/components/survey-display/SurveyDisplay";
import { Settings2, Play, Check, ChevronDown, Menu } from "lucide-react";
import * as Select from "@radix-ui/react-select";
import { GoogleFormsForm } from "@/types/GoogleFormSurvey";
import { signInWithGoogle, getGoogleTokens } from '@/utils/google-auth';
import Sidebar from "@/components/Sidebar";

// Update PlatformKey type
type PlatformKey = 'qualtrics' | 'surveymonkey' | 'googleforms';
type OptimizationStatus = 'idle' | 'optimizing' | 'ready' | 'error';
type OptimizedSurvey = GoogleFormsForm | SurveyType;

export default function DashboardPage() {
    const supabase = createClient();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [survey, setSurvey] = useState<SurveyType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("text");
    const [textContent, setTextContent] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState<PlatformKey>('googleforms');
    const [optimizationStatus, setOptimizationStatus] = useState<OptimizationStatus>('idle');
    const [optimizedSurvey, setOptimizedSurvey] = useState<OptimizedSurvey | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const [authStatus, setAuthStatus] = useState<'none' | 'success' | 'error'>('none');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [savedSurveys, setSavedSurveys] = useState<Array<{
        id: string;
        title: string;
        created_at: string;
    }>>([]);

    const platforms: Record<PlatformKey, { name: string; available: boolean }> = {
        qualtrics: { name: "Qualtrics", available: false },
        surveymonkey: { name: "SurveyMonkey", available: false },
        googleforms: { name: "Google Forms", available: true }
    };

    useEffect(() => {
        // Handle auth callback params
        const error = searchParams.get('error');
        const success = searchParams.get('success');
        
        if (error) {
            setError(
                error === 'google_auth_failed' ? 'Google authentication failed' :
                error === 'forms_access_denied' ? 'Access to Google Forms was denied' :
                'Failed to connect to Google'
            );
            setAuthStatus('error');
        } else if (success === 'connected') {
            setAuthStatus('success');
        }
    }, [searchParams]);

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
            setIsSidebarOpen(false); // Close sidebar on mobile after selection
        } catch (error) {
            console.error('Error fetching survey:', error);
        }
    };

    const handleNewSurvey = () => {
        setSurvey(null);
        setIsSidebarOpen(false); // Close sidebar on mobile
    };

    const handleDeleteSurvey = async (id: string) => {
        try {
            const response = await fetch(`/api/survey/${id}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete survey');
            }
            
            // Refresh surveys list
            fetchSurveys();
        } catch (error) {
            console.error('Error deleting survey:', error);
        }
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(droppedFile.type)) {
            setFile(droppedFile);
        }
    }, []);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    }, []);

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            setError(null);
            let content = '';

            if (activeTab === 'text') {
                content = textContent;
            } else if (file) {
                content = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target?.result as string);
                    reader.readAsText(file);
                });
            }

            const response = await fetch('/api/survey/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });

            const data = await response.json();

            if (!response.ok) {
                let errorMessage = data.error || 'Failed to generate survey';

                // Add helpful messages for specific error codes
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
            // Refresh the surveys list to include the newly generated survey
            await fetchSurveys();
        } catch (err) {
            const error = err as Error;
            setError(error.message);
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const isSubmitDisabled = (activeTab === "text" ? !textContent.trim() : !file) || 
        !platforms[selectedPlatform].available;

    const handlePlatformChange = (value: string) => {
        setSelectedPlatform(value as PlatformKey);
    };

    useEffect(() => {
        async function optimizeSurveyForPlatform() {
            if (!survey) return;
            
            setOptimizationStatus('optimizing');
            try {
                const optimized = await optimizeSurvey(survey, selectedPlatform === 'googleforms' ? 'google_forms' : selectedPlatform);
                setOptimizedSurvey(optimized);
                setOptimizationStatus('ready');
            } catch (err) {
                console.error('Optimization error:', err);
                setOptimizationStatus('error');
            }
        }

        optimizeSurveyForPlatform();
    }, [survey, selectedPlatform]);

    const handleGoogleFormsImport = async () => {
        if (!optimizedSurvey || optimizationStatus !== 'ready') return;
        
        try {
            setIsImporting(true);
            setError(null);
            
            // Check for Google tokens first
            const tokens = await getGoogleTokens();
            
            if (!tokens) {
                // Trigger Google sign in with required scopes
                await signInWithGoogle();
                return;
            }

            // Proceed with form import
            const response = await fetch('/api/survey/import/google-forms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ survey: optimizedSurvey }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 403 && data.requiresAuth) {
                    await signInWithGoogle();
                    return;
                }
                throw new Error(data.error || 'Failed to import survey');
            }

            // Open the created form in new tab
            window.open(data.url, '_blank');
            
        } catch (err) {
            console.error('Import error:', err);
            setError('Failed to import survey. Please try again.');
        } finally {
            setIsImporting(false);
        }
    };

    const handleConnect = () => {
        window.location.href = '/api/auth/google/signin';
    };

    return (
        <div className="flex flex-row h-screen w-full bg-neutral-950/50 overflow-hidden">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                surveys={savedSurveys}
                onSelectSurvey={handleSelectSurvey}
                onNewSurvey={handleNewSurvey}
                onDeleteSurvey={handleDeleteSurvey}
            />
            
            {/* Main Content Area */}
            <main className="flex flex-col h-screen w-full overflow-auto">
                {/* Mobile Header */}
                <div className="flex items-center lg:hidden h-16 px-4 border-b border-white/10">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-white/60 hover:text-white"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex px-4">
                    <div className="max-w-4xl w-full mx-auto py-8">
                        {!survey ? (
                            <div className="w-full h-full flex items-center justify-center flex-col">
                                <div className="flex flex-col items-center gap-2">
                                    <h1 className="text-3xl font-bold font-instrument-sans text-white">
                                        Create New Survey
                                    </h1>
                                    <p className="text-white/60">
                                        Generate a survey by providing text or uploading a file
                                    </p>
                                </div>

                                <div className="flex flex-col w-full gap-6 bg-white/5 border border-white/10 rounded-lg p-6 mt-8">
                                    <div className="flex gap-4 border-b border-white/10">
                                        <button
                                            onClick={() => setActiveTab("text")}
                                            className={`px-4 cursor-pointer py-2 font-medium border-b-2 transition-colors ${
                                                activeTab === "text"
                                                    ? "text-white border-[#3f4da8]"
                                                    : "text-white/60 hover:text-white/80 border-transparent hover:border-white/10"
                                            }`}
                                        >
                                            Text Input
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("file")}
                                            className={`px-4 cursor-pointer py-2 font-medium border-b-2 transition-colors ${
                                                activeTab === "file"
                                                    ? "text-white border-[#3f4da8]"
                                                    : "text-white/60 hover:text-white/80 border-transparent hover:border-white/10"
                                            }`}
                                        >
                                            File Upload
                                        </button>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <div className={activeTab === "text" ? "block" : "hidden"}>
                                            <label htmlFor="survey-text" className="block text-sm font-medium text-white/75 mb-2">
                                                Survey Context
                                            </label>
                                            <textarea
                                                id="survey-text"
                                                value={textContent}
                                                onChange={(e) => setTextContent(e.target.value)}
                                                className="w-full h-64 rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#3f4da8] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                                placeholder="Enter your survey context here..."
                                            />
                                        </div>

                                        <div
                                            className={`${activeTab === "file" ? "block" : "hidden"}`}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                        >
                                            <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                                isDragging
                                                    ? "border-[#3f4da8] bg-[#3f4da8]/5"
                                                    : "border-white/20 hover:border-white/30"
                                            }`}>
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="p-3 rounded-full bg-white/5">
                                                        <svg
                                                            className="w-6 h-6 text-white/60"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <div className="text-white font-medium">
                                                        {file ? (
                                                            file.name
                                                        ) : (
                                                            <>
                                                                Drop your file here, or{" "}
                                                                <label className="text-[#3f4da8] cursor-pointer hover:underline">
                                                                    browse
                                                                    <input
                                                                        type="file"
                                                                        className="hidden"
                                                                        accept=".pdf,.doc,.docx"
                                                                        onChange={handleFileChange}
                                                                    />
                                                                </label>
                                                            </>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-white/60">
                                                        {file
                                                            ? `${(file.size / 1024 / 1024).toFixed(2)}MB`
                                                            : "PDF, DOC, DOCX up to 10MB"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-3 mt-2">
                                            <Select.Root value={selectedPlatform} onValueChange={handlePlatformChange}>
                                                <Select.Trigger
                                                    className="w-full! cursor-pointer flex items-center justify-between gap-2 px-4 py-3 text-white/90 bg-white/5 hover:bg-white/10 rounded-md border border-white/15 transition-colors outline-none focus:ring-2 focus:ring-[#3f4da8] data-[placeholder]:text-white/60"
                                                    aria-label="Survey Platform"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Settings2 size={16} className="text-white/70" />
                                                        <Select.Value />
                                                        {!platforms[selectedPlatform].available && (
                                                            <span className="text-xs text-white/30">(coming soon)</span>
                                                        )}
                                                    </div>
                                                    <Select.Icon>
                                                        <ChevronDown size={16} className="text-white/70" />
                                                    </Select.Icon>
                                                </Select.Trigger>

                                                <Select.Portal>
                                                    <Select.Content
                                                        className="overflow-hidden bg-[#1a1a1a] border w-[280px] ml-2 mb-1 border-white/15 rounded-md shadow-lg"
                                                        position="popper"
                                                        sideOffset={4}
                                                    >
                                                        <Select.Viewport>
                                                            {Object.entries(platforms).map(([value, { name, available }]) => (
                                                                <Select.Item
                                                                    key={value}
                                                                    value={value}
                                                                    disabled={!available}
                                                                    className={`
                                                                        flex items-center justify-between px-4 py-2.5 text-sm
                                                                        ${available 
                                                                            ? 'text-white/90 hover:bg-white/5 hover:text-white cursor-pointer' 
                                                                            : 'text-white/40 cursor-not-allowed hover:bg-transparent'}
                                                                        outline-none data-[highlighted]:bg-white/5 data-[highlighted]:text-white
                                                                    `}
                                                                >
                                                                    <div className="flex items-center justify-between flex-1">
                                                                        <Select.ItemText>{name}</Select.ItemText>
                                                                        {!available && (
                                                                            <span className="text-xs text-white/30 ml-2">
                                                                                (coming soon)
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    {available && (
                                                                        <Select.ItemIndicator>
                                                                            <Check size={16} className="text-white/70" />
                                                                        </Select.ItemIndicator>
                                                                    )}
                                                                </Select.Item>
                                                            ))}
                                                        </Select.Viewport>
                                                    </Select.Content>
                                                </Select.Portal>
                                            </Select.Root>

                                            <button
                                                onClick={handleSubmit}
                                                disabled={isSubmitDisabled || isLoading}
                                                className={`flex-1 cursor-pointer inline-flex items-center justify-center rounded-md px-4 py-3 font-medium text-white focus:outline-none focus:ring-2 focus:ring-[#fff4] focus:ring-offset-2 transition-colors ${
                                                    isSubmitDisabled || isLoading
                                                        ? "bg-[#3f4da8]/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#3f4da8]/50"
                                                        : "bg-[#3f4da8] hover:bg-[#3f4da8]/90"
                                                }`}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                                                        Generating Survey...
                                                    </>
                                                ) : (
                                                    <span className="flex items-center gap-2">
                                                        <Play size={16} className="text-white/90" />
                                                        Start Survey Generation
                                                    </span>
                                                )}
                                            </button>
                                        </div>

                                        {error && (
                                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-md text-red-400">
                                                {error}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
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
                                            onClick={handleSubmit}
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
                                                {optimizationStatus === 'optimizing' ? 'Optimizing for' :
                                                 optimizationStatus === 'ready' ? 'Ready to import to' :
                                                 optimizationStatus === 'error' ? 'Error optimizing for' :
                                                 'Select platform:'} {platforms[selectedPlatform].name}
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
                                                    {isImporting ? 'Importing...' : `Import to ${platforms[selectedPlatform].name}`}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleConnect}
                                                    className="px-4 py-2 bg-[#3f4da8] text-white rounded-md hover:bg-[#3f4da8]/90 transition-colors"
                                                >
                                                    Connect Google Account
                                                </button>
                                            )}
                                            {authStatus === 'error' && error && (
                                                <p className="mt-2 text-sm text-red-400">{error}</p>
                                            )}
                                        </div>
                                    )}

                                    {optimizationStatus === 'error' && (
                                        <p className="mt-4 text-red-400">
                                            Failed to optimize survey for {platforms[selectedPlatform].name}. Please try again.
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
