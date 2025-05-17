"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideArrowRight } from "lucide-react";

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
    const nonAuthRoute = authRoutes.some((route) => pathname.includes(route));

    return (
        <header className="text-white py-3 px-16 fixed w-full top-0 z-50 select-none mt-2">
            <div className=" mx-auto flex items-center justify-between max-w-[1560px] ">
                <Link
                    href={"/"}
                    className="flex flex-row items-center justify-center gap-3 opacity-75 hover:opacity-100 duration-200 cursor-pointer"
                >
                    <h1 className="text-2xl font-semibold tracking-tight font-sans mr-8">
                        Survey Forge
                    </h1>
                </Link>

                {!nonAuthRoute ? (
                    <>
                        <nav className="space-x-8">
                            <NavLink href="/templates">Templates</NavLink>
                            <NavLink href="/templates">Documentation</NavLink>
                            <NavLink href="/pricing">Pricing</NavLink>
                            <NavLink href="/about">About</NavLink>
                        </nav>

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
                    </>
                ) : (
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
                )}
            </div>
        </header>
    );
};

export default Header;
