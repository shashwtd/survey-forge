"use client";

import React from "react";
import Link from "next/link";

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

const Header: React.FC = () => {
    return (
        <header className="text-white py-3 px-4 fixed w-full top-0 z-50 select-none mt-2">
            <div className="container mx-auto flex items-center justify-between">
                <Link href={"/"} className="flex flex-row items-center justify-center gap-3 opacity-75 hover:opacity-100 duration-200 cursor-pointer">
                    <h1 className="text-2xl font-semibold tracking-tight font-sans mr-8">
                        Survey Forge
                    </h1>
                </Link>

                <nav className="space-x-8">
                    <NavLink href="/templates">Templates</NavLink>
                    <NavLink href="/pricing">Pricing</NavLink>
                    <NavLink href="/about">About</NavLink>
                </nav>

                <div className="flex items-center space-x-5">
                    <NavLink href="/login" className="">Login</NavLink>
                    <Link href={"/register"} className="group flex items-center justify-center gap-2 w-max h-max px-5 pl-6 py-1.25 pb-1.5 my-1 rounded-full bg-[#2a4396] cursor-pointer duration-200">
                        <span className="text-white/85 font-medium text-[17px]">
                            Get Started
                        </span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            className="size-5 group-hover:translate-x-0.5 duration-200"
                            viewBox="0 0 24 24"
                        >
                            <path
                                id="SVGRepo_iconCarrier"
                                stroke="#eee"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 12h14m0 0-6-6m6 6-6 6"
                            ></path>
                        </svg>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
