"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LucideArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

const Tooltip = ({ children }: { children: React.ReactNode }) => (
    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-2 bg-neutral-900 rounded-lg text-sm text-white/80 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        {children}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-neutral-900" />
    </div>
);

interface NavLinkProps {
    children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps & { className?: string }> = ({
    children,
    className,
}) => {
    return (
        <div className="relative group">
            <div
                className={`hover:text-white/80 text-lg transition-colors font-sans text-white/60 ${className}`}
            >
                {children}
            </div>
            <Tooltip>TBA</Tooltip>
        </div>
    );
};

const Header: React.FC = () => {
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
            }
        };
        getUser();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                setUser(session.user);
            } else {
                setUser(null);
            }
            router.refresh();
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth, router]);



    return (
        <header className="text-white py-3 backdrop-blur-2xl px-16 fixed w-full top-0 z-50 select-none bg-black/5">
            <div className="mx-auto flex items-center justify-between max-w-[1560px]">
                <Link
                    href={"/"}
                    className="flex flex-row items-center justify-center gap-3 opacity-75 hover:opacity-100 duration-200 cursor-pointer"
                >
                    <h1 className="text-2xl font-semibold tracking-tight font-sans mr-8">
                        Survey Forge
                    </h1>
                </Link>

                <nav className="space-x-8 flex flex-row">
                    <NavLink>Templates</NavLink>
                    <NavLink>Documentation</NavLink>
                    <NavLink>Pricing</NavLink>
                    <NavLink>About</NavLink>
                </nav>

                {user ? (
                    // Dasshboard link
                    <Link
                        href={"/survey/create"}
                        className="group flex items-center justify-center gap-2 w-max h-max px-5 pl-6 py-1.25 pb-1.5 my-1 border border-white/15 rounded-full bg-white/5 hover:bg-white/10 cursor-pointer duration-200"
                    >
                        <span className="text-white/85 font-medium text-base">
                            Dashboard
                        </span>
                    </Link>
                ) : (
                    <div className="flex items-center space-x-5">
                        <Link href="/login" className="hover:text-white/80 text-lg transition-colors font-sans text-white/60">
                            Login
                        </Link>
                        <Link
                            href={"/signup"}
                            className="group flex items-center justify-center gap-2 w-max h-max px-5 pl-6 py-1.25 pb-1.5 my-1 rounded-full bg-[#3f4da8] hover:bg-[#28368f] cursor-pointer duration-200"
                        >
                            <span className="text-white/85 font-medium text-[17px]">
                                Get Started
                            </span>
                            <LucideArrowRight
                                className="text-white/85 group-hover:text-white/100 duration-300 group-hover:translate-x-1"
                                size={16}
                            />
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
