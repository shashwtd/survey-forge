"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Survey } from "@/types/survey";
import SurveyDisplay from "@/components/SurveyDisplay";

export default function DashboardPage() {
    const supabase = createClient();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [survey, setSurvey] = useState<Survey | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("text");
    const [textContent, setTextContent] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/login");
            }
        };
        checkUser();
    }, [supabase.auth, router]);

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

            if (!response.ok) {
                throw new Error('Failed to generate survey');
            }

            const surveyData = await response.json();
            setSurvey(surveyData);
        } catch (err) {
            setError('Failed to generate survey. Please try again.');
            console.error('Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const isSubmitDisabled = activeTab === "text" ? !textContent.trim() : !file;

    return (
        <div className="flex-1 w-screen h-screen bg-neutral-950/50 flex flex-col gap-8 p-4 items-center">
            <div className="flex w-full items-center justify-center flex-col max-w-5xl gap-8 mt-28">
                {!survey ? (
                    <>
                        <div className="flex flex-col items-center gap-2">
                            <h1 className="text-3xl font-bold font-instrument-sans text-white">
                                Create New Survey
                            </h1>
                            <p className="text-white/60">
                                Generate a survey by providing text or uploading a file
                            </p>
                        </div>

                        <div className="flex flex-col w-full gap-6 bg-white/5 border border-white/10 rounded-lg p-6">
                            <div className="flex gap-4 border-b border-white/10">
                                <button
                                    onClick={() => setActiveTab("text")}
                                    className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                                        activeTab === "text"
                                            ? "text-white border-[#3f4da8]"
                                            : "text-white/60 hover:text-white/80 border-transparent"
                                    }`}
                                >
                                    Text Input
                                </button>
                                <button
                                    onClick={() => setActiveTab("file")}
                                    className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                                        activeTab === "file"
                                            ? "text-white border-[#3f4da8]"
                                            : "text-white/60 hover:text-white/80 border-transparent"
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

                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitDisabled || isLoading}
                                    className={`w-full inline-flex items-center justify-center rounded-md px-4 py-3 font-medium text-white focus:outline-none focus:ring-2 focus:ring-[#fff4] focus:ring-offset-2 transition-colors ${
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
                                        "Start Survey Generation"
                                    )}
                                </button>

                                {error && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-md text-red-400">
                                        {error}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="w-full">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white font-instrument-sans">Generated Survey</h2>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setSurvey(null)}
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
                    </div>
                )}
            </div>
        </div>
    );
}
