import { MoreVertical } from "lucide-react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { SurveyType } from "@/types/survey";

interface DashboardHeaderProps {
    survey: { id: string; content: SurveyType } | null;
    onRenameSurvey: (newTitle: string) => Promise<void>;
    onDeleteSurvey: () => void;
    exportStatus: {
        status: 'idle' | 'exporting' | 'optimizing' | 'creating' | 'success' | 'error';
        message?: string;
    };
    authStatus: string;
    onGoogleFormsExport: (id: string) => Promise<void>;
    onConnect: () => void;
    isLoading: boolean;
}

export default function DashboardHeader({ 
    survey,
    onRenameSurvey,
    onDeleteSurvey,
    exportStatus,
    authStatus,
    onGoogleFormsExport,
    onConnect,
    isLoading
}: DashboardHeaderProps) {
    const handleRenameSurvey = async (newTitle: string) => {
        if (!survey) return;
        onRenameSurvey(newTitle).catch(console.error);
    }

    const handleGoogleFormsExport = async () => {
        if (!survey) return;
        if (exportStatus.status !== 'idle' && exportStatus.status !== 'error') return;
        if (authStatus === 'success') {
            await onGoogleFormsExport(survey.id);
        } else {
            onConnect();
        }
    }

    const getExportButtonContent = () => {
        if (exportStatus.status === 'exporting' || exportStatus.status === 'optimizing' || exportStatus.status === 'creating') {
            return (
                <>
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></div>
                    {exportStatus.message || 'Processing...'}
                </>
            );
        }

        if (exportStatus.status === 'success') {
            return (
                <>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    {exportStatus.message || 'Success!'}
                </>
            );
        }

        if (exportStatus.status === 'error') {
            return (
                <>
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    {exportStatus.message || 'Error'}
                </>
            );
        }

        if (authStatus === 'checking') {
            return (
                <>
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></div>
                    Checking auth...
                </>
            );
        }

        return (
            <>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                {authStatus === 'success' ? 'Export to Google Forms' : 'Connect Google Account'}
            </>
        );
    };

    return (
        <>
            {survey && (
                <div className="backdrop-blur-xl bg-neutral-900/95 border-b border-white/10">
                    <div className="max-w-4xl mx-auto w-full h-14 flex items-center justify-between">
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                                <button className="group relative flex items-center px-2 -ml-4 py-2 text-white/80 hover:bg-white/5 rounded-md cursor-pointer transition-colors">
                                    { isLoading ? (
                                        // skeleton loader
                                        <span className="w-40 h-4 bg-neutral-800 animate-pulse rounded-md"></span>
                                    ) : (
                                        <span className="text-sm truncate max-w-[300px]">{survey.content.title} </span>
                                    )}
                                    <MoreVertical size={14} className="ml-2 opacity-0 group-hover:opacity-100 text-white/40 hover:text-white transition-all" />
                                </button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Portal>
                                <DropdownMenu.Content
                                    className="min-w-[160px] bg-neutral-800/95 backdrop-blur-xl rounded-lg p-1 shadow-xl border border-white/10 z-[200]"
                                    sideOffset={5}
                                    align="start"
                                >
                                    <DropdownMenu.Item 
                                        onSelect={() => {
                                            const newTitle = window.prompt('Enter new title:', survey.content.title);
                                            if (newTitle && newTitle !== survey.content.title) {
                                                handleRenameSurvey(newTitle);
                                            }
                                        }}
                                        className="text-sm text-white/80 hover:text-white hover:bg-white/5 px-2 py-1.5 rounded-md cursor-pointer outline-none transition-colors"
                                    >
                                        Rename
                                    </DropdownMenu.Item>
                                    <DropdownMenu.Item 
                                        onSelect={onDeleteSurvey}
                                        className="text-sm text-red-400 hover:text-red-300 hover:bg-white/5 px-2 py-1.5 rounded-md cursor-pointer outline-none transition-colors"
                                    >
                                        Delete
                                    </DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                        <button
                            onClick={handleGoogleFormsExport}
                            disabled={exportStatus.status !== 'idle' && exportStatus.status !== 'error'}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/15 text-zinc-200 text-sm rounded-md transition-colors disabled:opacity-70 disabled:hover:bg-white/10 disabled:cursor-not-allowed"
                        >
                            {getExportButtonContent()}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
