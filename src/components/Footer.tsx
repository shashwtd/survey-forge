"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();

    // Don't render footer on dashboard page
    if (pathname.startsWith("/survey")) {
        return null;
    }

    return (
        <footer className="relative bg-[#111] text-white overflow-hidden">
            {/* Light beam decorative elements */}
            <div className="absolute left-0 top-0 -translate-y-1/2 opacity-30">
                <Image
                    src="/assets/light_beam_towards_left.svg"
                    alt=""
                    width={600}
                    height={400}
                    className="w-[300px] md:w-[600px]"
                />
            </div>
            <div className="absolute right-0 top-0 -translate-y-1/2 opacity-30">
                <Image
                    src="/assets/light_beam_towards_right.svg"
                    alt=""
                    width={600}
                    height={400}
                    className="w-[300px] md:w-[600px]"
                />
            </div>

            <div className="relative mx-auto max-w-6xl px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
                    {/* Logo and description */}
                    <div className="col-span-1 md:col-span-5">
                        <h1 className="font-instrument-sans text-2xl md:text-3xl font-semibold text-white/90">
                            SurveyForge
                        </h1>
                        <p className="mt-4 text-sm max-w-md text-gray-300 font-sans">
                            Create smarter surveys with AI-powered insights.
                            Generate comprehensive questionnaires tailored to
                            your needs instantly.
                        </p>
                        {/* Social Links */}
                        <div className="mt-6 flex space-x-4">
                            <span className="text-gray-500 cursor-not-allowed p-2 hover:text-gray-400 transition-colors duration-200" title="WIP">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                            </span>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex flex-row items-start justify-end gap-16 md:col-span-7 md:grid-cols-2">
                        {/* Product Links */}
                        <div>
                            <h3 className="text-sm font-semibold">
                                Product
                            </h3>
                            <ul className="mt-4 space-y-2">
                                <li>
                                    <Link
                                        href="/survey/create"
                                        className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                                    >
                                        Create Survey
                                    </Link>
                                </li>
                                <li>
                                    <span 
                                        className="text-sm text-gray-500 cursor-not-allowed hover:text-gray-400 transition-colors duration-200" 
                                        title="WIP"
                                    >
                                        Features
                                    </span>
                                </li>
                                <li>
                                    <span 
                                        className="text-sm text-gray-500 cursor-not-allowed hover:text-gray-400 transition-colors duration-200" 
                                        title="WIP"
                                    >
                                        Pricing
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Company Links */}
                        <div>
                            <h3 className="text-sm font-semibold">
                                Company
                            </h3>
                            <ul className="mt-4 space-y-2">
                                <li>
                                    <span 
                                        className="text-sm text-gray-500 cursor-not-allowed hover:text-gray-400 transition-colors duration-200" 
                                        title="WIP"
                                    >
                                        About
                                    </span>
                                </li>
                                <li>
                                    <span 
                                        className="text-sm text-gray-500 cursor-not-allowed hover:text-gray-400 transition-colors duration-200" 
                                        title="WIP"
                                    >
                                        Privacy
                                    </span>
                                </li>
                                <li>
                                    <span 
                                        className="text-sm text-gray-500 cursor-not-allowed hover:text-gray-400 transition-colors duration-200" 
                                        title="WIP"
                                    >
                                        Terms
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* Bottom bar */}
                <div className="mt-12 border-t border-gray-700 pt-8">
                    <p className="text-center text-sm text-gray-400">
                        © {new Date().getFullYear()} Survey Forge. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
