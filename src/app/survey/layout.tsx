"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Sidebar from "@/components/dashboard/Sidebar";

export default function SurveyLayout({ children }: { children: React.ReactNode }) {
    const supabase = createClient();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/login");
            }
        };
        checkUser();
    }, [supabase.auth, router]);

    return (
        <div className="flex flex-row h-screen w-full bg-[#09090b] overflow-hidden">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onNewSurvey={() => {
                    router.push('/survey/create');
                    setIsSidebarOpen(false);
                }}
            />
            <main className="flex flex-col h-screen w-full overflow-auto relative">
                {children}
            </main>
        </div>
    );
}
