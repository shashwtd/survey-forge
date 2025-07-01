import { Menu, MoreVertical } from "lucide-react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { SurveyType } from "@/types/survey";

interface DashboardHeaderProps {
    survey: { id: string; content: SurveyType } | null;
    onRenameSurvey: (newTitle: string) => Promise<void>;
    onDeleteSurvey: () => void;
    onToggleSidebar: () => void;
    isImporting: boolean;
    optimizationStatus: string;
    authStatus: string;
    onGoogleFormsImport: () => Promise<void>;
    onConnect: () => void;
}

export default function DashboardHeader({ 
    survey,
    onRenameSurvey,
    onDeleteSurvey,
    onToggleSidebar,
    isImporting,
    optimizationStatus,
    authStatus,
    onGoogleFormsImport,
    onConnect
}: DashboardHeaderProps) {
    return (
        <>
            {/* Mobile menu */}
            <div className="flex items-center lg:hidden h-16 px-4 border-b border-zinc-800 bg-zinc-900">
                <button
                    onClick={onToggleSidebar}
                    className="p-2 text-white/70 hover:text-white transition-colors"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Floating header */}
            {survey && (
                <div className="sticky top-0 z-10 backdrop-blur-xl bg-neutral-900/95 border-b border-white/10">
                    <div className="max-w-4xl mx-auto w-full h-14 flex items-center justify-between">
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                                <button className="group relative flex items-center px-2 py-2 text-white/80 hover:bg-white/5 rounded-md cursor-pointer transition-colors">
                                    <span className="text-sm truncate max-w-[300px]">{survey.content.title}</span>
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
                                                onRenameSurvey(newTitle);
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
                        {optimizationStatus === 'ready' && (
                            <button
                                onClick={authStatus === 'success' ? onGoogleFormsImport : onConnect}
                                disabled={isImporting}
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/15 text-zinc-200 text-sm rounded-md transition-colors disabled:opacity-70 disabled:hover:bg-white/10"
                            >
                                {isImporting ? (
                                    <>
                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></div>
                                        Exporting...
                                    </>
                                ) : (
                                    <>
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                        {authStatus === 'success' ? 'Export to Google Forms' : 'Connect Google Account'}
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
