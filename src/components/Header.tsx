"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LucideArrowRight, Settings, LogOut, ChevronDown } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
}
const NavLink: React.FC<NavLinkProps & { className?: string }> = ({
    href,
    children,
    className,
}) => {
    return (
        <Link
            href={href}
            className={`hover:text-white/80 text-lg transition-colors font-sans text-white/60 ${className}`}
        >
            {children}
        </Link>
    );
};
const authRoutes = ["/signup", "/login", "/forgot-password"];

const Header: React.FC = () => {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const isAuthPage = authRoutes.some((route) => pathname.includes(route));
    const isDashbaordRoute = pathname.includes("/dashboard");

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
    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsDropdownOpen(false);
        router.refresh();
        router.push("/");
    };

    return (
        <header
            className={`text-white py-3 backdrop-blur-2xl px-16 fixed w-full top-0 z-50 select-none ${
                isDashbaordRoute
                    ? "border-b border-white/15 bg-neutral-950"
                    : "bg-black/50"
            }`}
        >
            <div className=" mx-auto flex items-center justify-between max-w-[1560px] ">
                <Link
                    href={"/"}
                    className="flex flex-row items-center justify-center gap-3 opacity-75 hover:opacity-100 duration-200 cursor-pointer"
                >
                    <h1 className="text-2xl font-semibold tracking-tight font-sans mr-8">
                        Survey Forge
                    </h1>
                </Link>

                {!isAuthPage && !isDashbaordRoute && (
                    <nav className="space-x-8">
                        <NavLink href="/templates">Templates</NavLink>
                        <NavLink href="/templates">Documentation</NavLink>
                        <NavLink href="/pricing">Pricing</NavLink>
                        <NavLink href="/about">About</NavLink>
                    </nav>
                )}

                {user ? (
                    <>
                        {isDashbaordRoute ? (
                            // THIS IS THE USER DROPDOWN
                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setIsDropdownOpen(!isDropdownOpen)
                                    }
                                    className="group flex cursor-pointer items-center gap-3 py-1.5 px-2 rounded-full border border-white/10 hover:border-white/20 bg-gradient-to-b from-white/5 to-white/[0.02] hover:from-white/10 hover:to-white/[0.05] transition-all duration-200"
                                >
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#3f4da8] to-[#28368f] flex items-center justify-center ring-2 ring-white/10 group-hover:ring-white/20 transition-all">
                                        <span className="text-sm font-medium text-white">
                                            {user?.email
                                                ?.split("@")[0]
                                                .slice(0, 2)
                                                .toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 pr-2">
                                        <div className="flex flex-col items-start">
                                            <span className="text-sm font-medium text-white group-hover:text-white/90 transition-colors">
                                                {user?.email?.split("@")[0]}
                                            </span>
                                            <span className="text-xs text-white/40 group-hover:text-white/50 transition-colors">
                                                Free Plan
                                            </span>
                                        </div>
                                        <ChevronDown
                                            size={16}
                                            className={`text-white/40 group-hover:text-white/60 transition-all duration-300 ${
                                                isDropdownOpen
                                                    ? "rotate-180"
                                                    : ""
                                            }`}
                                        />
                                    </div>
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 py-2 bg-neutral-900 backdrop-blur-xl rounded-xl border border-white/10 shadow-xl">
                                        <div className="px-4 py-2 border-b border-white/[0.06]">
                                            <p className="text-xs font-medium text-white/40">
                                                Signed in as
                                            </p>
                                            <p className="text-sm font-medium text-white truncate">
                                                {user?.email}
                                            </p>
                                        </div>
                                        <div className="py-1.5">
                                            <button className="w-full cursor-pointer flex items-center gap-3 px-4 py-2 text-sm text-white/60 hover:text-white transition-colors hover:bg-white/[0.06]">
                                                <Settings size={15} />
                                                Settings
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full cursor-pointer flex items-center gap-3 px-4 py-2 text-sm text-white/60 hover:text-red-400 transition-colors hover:bg-white/[0.06]"
                                            >
                                                <LogOut size={15} />
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // THIS IS THE DASBHOARD LINK
                            <Link
                                href={"/dashboard"}
                                className="group flex items-center justify-center gap-2 w-max h-max px-5 pl-6 py-1.25 pb-1.5 my-1 rounded-full bg-[#424558] hover:bg-[#333544] cursor-pointer duration-200"
                            >
                                <span className="text-white/85 font-medium text-[17px]">
                                    Dashboard
                                </span>
                                <LucideArrowRight
                                    className="text-white/85 group-hover:text-white/100 duration-300 group-hover:translate-x-1"
                                    size={16}
                                />
                            </Link>
                        )}
                    </>
                ) : (
                    <>
                        {isAuthPage ? (
                            <nav className="flex flex-row items-center gap-4">
                                <NavLink href="/login" className="text-base">
                                    Login
                                </NavLink>
                                <Link
                                    href={"/signup"}
                                    className="group flex items-center justify-center gap-2 w-max h-max px-4 pl-6 py-1.25 pb-1.5 my-1 rounded-md bg-[#223a] hover:bg-[#223] cursor-pointer duration-200"
                                >
                                    <span className="text-white/75 font-medium">
                                        Sign Up
                                    </span>
                                </Link>
                            </nav>
                        ) : (
                            <div className="flex items-center space-x-5">
                                <NavLink href="/login" className="">
                                    Login
                                </NavLink>
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
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
