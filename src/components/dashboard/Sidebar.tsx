import React, { useState, useEffect } from 'react';
import { X, Plus, MoreVertical, Settings, LogOut, ChevronDown, Library } from 'lucide-react';
import Link from 'next/link';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from 'next/navigation';

interface SurveyHistory {
    id: string;
    title: string;
    created_at: string;
}

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    surveys: SurveyHistory[];
    onSelectSurvey: (id: string) => void;
    onNewSurvey: () => void;
    onDeleteSurvey?: (id: string) => void;
}

export default function Sidebar({
    isOpen,
    onClose,
    surveys,
    onSelectSurvey,
    onNewSurvey,
    onDeleteSurvey
}: SidebarProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
            }
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                setUser(session.user);
            } else {
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsUserDropdownOpen(false);
        router.refresh();
        router.push("/");
    };

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
                top-0 left-0 z-[100] flex flex-col h-full min-w-64 w-64
                bg-neutral-900/95 backdrop-blur-xl border-r border-white/10
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
            `}>
                {/* Header */}
                <div className="flex items-center h-14 px-4 border-b border-white/10">
                    <Link href="/" className="flex items-center gap-2">
                        <Library size={20} className="text-[#4f61d4]" />
                        <span className="text-white font-medium">Survey Forge</span>
                    </Link>
                    <button
                        onClick={onClose}
                        className="lg:hidden ml-auto p-2 text-white/60 hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* New Survey Button */}
                <div className="p-3">
                    <button
                        onClick={onNewSurvey}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#3f4da8] rounded-lg hover:bg-[#3f4da8]/90 transition-colors"
                    >
                        <Plus size={16} />
                        <span>New Survey</span>
                    </button>
                </div>

                {/* Survey List */}
                <div className="flex-1 overflow-y-auto">
                    <div className="px-3 py-2">
                        <div className="text-xs font-medium text-white/40 px-2 pb-2">
                            Your Surveys
                        </div>
                        <div className="flex flex-col gap-0.5">
                            {surveys.map((survey) => (
                                <div
                                    key={survey.id}
                                    className="group relative flex items-center px-2 py-2 text-white/80 hover:bg-white/5 rounded-md cursor-pointer transition-colors"
                                    onClick={() => onSelectSurvey(survey.id)}
                                >
                                    {/* Survey Title */}
                                    <div className="flex-1 min-w-0">
                                        <span className="block text-sm truncate">
                                            {survey.title}
                                        </span>
                                    </div>

                                    {/* Actions Menu */}
                                    <DropdownMenu.Root>
                                        <DropdownMenu.Trigger asChild>
                                            <button 
                                                className="opacity-0 group-hover:opacity-100 ml-2 p-1 text-white/40 hover:text-white bg-neutral-800/80 backdrop-blur-sm rounded transition-all"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <MoreVertical size={14} />
                                            </button>
                                        </DropdownMenu.Trigger>

                                        <DropdownMenu.Portal>
                                            <DropdownMenu.Content
                                                className="min-w-[160px] bg-neutral-800/95 backdrop-blur-xl rounded-lg p-1 shadow-xl border border-white/10 z-[200]"
                                                sideOffset={5}
                                                align="end"
                                            >
                                                <DropdownMenu.Item
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onSelectSurvey(survey.id);
                                                    }}
                                                    className="text-sm text-white/80 hover:text-white hover:bg-white/5 px-2 py-1.5 rounded-md cursor-pointer outline-none transition-colors"
                                                >
                                                    Open Survey
                                                </DropdownMenu.Item>
                                                
                                                {onDeleteSurvey && (
                                                    <DropdownMenu.Item
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (window.confirm('Are you sure you want to delete this survey? This action cannot be undone.')) {
                                                                onDeleteSurvey(survey.id);
                                                            }
                                                        }}
                                                        className="text-sm text-red-400 hover:text-red-300 hover:bg-white/5 px-2 py-1.5 rounded-md cursor-pointer outline-none transition-colors"
                                                    >
                                                        Delete Survey
                                                    </DropdownMenu.Item>
                                                )}
                                            </DropdownMenu.Content>
                                        </DropdownMenu.Portal>
                                    </DropdownMenu.Root>

                                    {/* Date tooltip */}
                                    <div className="absolute left-2 -top-8 bg-neutral-800/95 backdrop-blur-xl text-white/80 text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 z-[150]">
                                        {new Date(survey.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* User Profile Section */}
                {user && (
                    <div className="px-3 py-3 border-t border-white/10">
                        <div className="relative">
                            <button
                                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                className="w-full group flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all duration-200"
                            >
                                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[#3f4da8] to-[#28368f] flex items-center justify-center ring-1 ring-white/20 group-hover:ring-white/30 transition-all">
                                    <span className="text-sm font-medium text-white">
                                        {user?.email?.split("@")[0].slice(0, 2).toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <div className="flex flex-col items-start min-w-0">
                                        <span className="text-sm font-medium text-white truncate max-w-[120px]">
                                            {user?.email?.split("@")[0]}
                                        </span>
                                        <span className="text-xs text-white/40">
                                            Free Plan
                                        </span>
                                    </div>
                                    <ChevronDown
                                        size={14}
                                        className={`ml-auto text-white/40 transition-transform duration-200 ${
                                            isUserDropdownOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </div>
                            </button>

                            {isUserDropdownOpen && (
                                <div className="absolute bottom-full left-0 right-0 mb-2 py-2 bg-neutral-800/95 backdrop-blur-xl rounded-lg border border-white/10 shadow-xl">
                                    <div className="px-4 py-2 border-b border-white/10">
                                        <p className="text-xs font-medium text-white/40">
                                            Signed in as
                                        </p>
                                        <p className="text-sm font-medium text-white truncate mt-0.5">
                                            {user?.email}
                                        </p>
                                    </div>
                                    <div className="py-1.5">
                                        <button className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                                            <Settings size={14} />
                                            Settings
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-white/60 hover:text-red-400 hover:bg-white/5 transition-colors"
                                        >
                                            <LogOut size={14} />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
