import { useState, useCallback } from 'react';
import { Settings2, Play, Check, ChevronDown } from 'lucide-react';
import * as Select from '@radix-ui/react-select';
import { extractFileContent } from '@/utils/fileExtractors';

type PlatformKey = 'qualtrics' | 'surveymonkey' | 'googleforms';

interface SurveyCreatorProps {
    onSubmit: (content: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

const platforms: Record<PlatformKey, { name: string; available: boolean }> = {
    qualtrics: { name: "Qualtrics", available: false },
    surveymonkey: { name: "SurveyMonkey", available: false },
    googleforms: { name: "Google Forms", available: true }
};

export function SurveyCreator({ onSubmit, isLoading, error }: SurveyCreatorProps) {
    const [activeTab, setActiveTab] = useState("text");
    const [textContent, setTextContent] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [fileContext, setFileContext] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState<PlatformKey>('googleforms');

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const validateFile = useCallback((file: File) => {
        const validTypes = [
            "text/plain",
            "text/markdown",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];
        
        if (!validTypes.includes(file.type)) {
            return "Invalid file type. Please upload a PDF or Word document.";
        }
        
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size === 0) {
            return "File appears to be empty.";
        }
        if (file.size > maxSize) {
            return "File size exceeds 10MB limit.";
        }
        
        return null;
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            const error = validateFile(droppedFile);
            if (error) {
                // You might want to show this error to the user
                console.error(error);
                return;
            }
            setFile(droppedFile);
        }
    }, [validateFile]);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const error = validateFile(selectedFile);
            if (error) {
                // You might want to show this error to the user
                console.error(error);
                return;
            }
            setFile(selectedFile);
        }
    }, [validateFile]);

    const handleSubmit = async () => {
        let content = '';

        try {
            if (activeTab === 'text') {
                content = textContent;
            } else if (file) {
                const fileContent = await extractFileContent(file);
                content = fileContext ? `${fileContext}\n\n${fileContent}` : fileContent;
            }

            await onSubmit(content);
        } catch (err) {
            console.error('Error processing file:', err);
        }
    };

    const isSubmitDisabled = (activeTab === "text" ? !textContent.trim() : !file) || 
        !platforms[selectedPlatform].available;

    return (
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
                {/* Tab Selection */}
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
                    {/* Text Input */}
                    <div className={activeTab === "text" ? "block" : "hidden"}>
                        <label htmlFor="survey-text" className="block text-sm font-medium text-white/75 mb-2">
                            Survey Context
                        </label>
                        <textarea
                            id="survey-text"
                            value={textContent}
                            onChange={(e) => setTextContent(e.target.value)}
                            className="w-full h-64 rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#3f4da8] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                            placeholder="Describe your survey needs here. For example:&#10;&#10;• Topic or research area you want to explore&#10;• Target audience (e.g., customers, employees, students)&#10;• Key objectives or insights you want to gather&#10;• Specific questions you'd like to include&#10;• Any special requirements or preferences&#10;&#10;The more details you provide, the better the generated survey will match your needs."
                        />
                    </div>

                    {/* File Upload */}
                    <div
                        className={`${activeTab === "file" ? "flex flex-col gap-4" : "hidden"}`}
                    >
                        <div>
                            <label htmlFor="file-context" className="block text-sm font-medium text-white/75 mb-2">
                                Additional Context (Optional)
                            </label>
                            <textarea
                                id="file-context"
                                value={fileContext}
                                onChange={(e) => setFileContext(e.target.value)}
                                className="w-full h-20 rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#3f4da8] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                placeholder="Add any additional context or specific requirements for the survey generation:&#10;&#10;• Highlight specific sections to focus on&#10;• Add custom questions you'd like to include&#10;• Specify target audience or survey style preferences"
                            />
                        </div>
                        
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                isDragging
                                    ? "border-[#3f4da8] bg-[#3f4da8]/5"
                                    : "border-white/20 hover:border-white/30"
                            }`}
                        >
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
                                                    accept=".pdf,.doc,.docx,text/plain,text/markdown"
                                                    onChange={handleFileChange}
                                                />
                                            </label>
                                        </>
                                    )}
                                </div>
                                <p className="text-sm text-white/60">
                                    {file
                                        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                                        : "PDF, DOC, DOCX up to 10MB"}
                                </p>
                            </div>
                        </div>
                        
                    </div>

                    {/* Platform Selection and Submit */}
                    <div className="grid sm:grid-cols-2 gap-3 mt-2">
                        <Select.Root value={selectedPlatform} onValueChange={(value: PlatformKey) => setSelectedPlatform(value)}>
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
    );
}
