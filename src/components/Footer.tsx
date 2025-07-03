"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();

    // Don't render footer on dashboard page
    if (pathname.startsWith('/survey')) {
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
                <div className="grid grid-cols-1 gap-8 md:grid-cols-7">
                    {/* Logo and description */}
                    <div className="col-span-1 md:col-span-5">
                        <h1 className="font-instrument-sans text-2xl md:text-3xl font-semibold text-white/90">SurveyForge</h1>
                        <p className="mt-4 text-sm max-w-md text-gray-300 font-sans">
                            Create smarter surveys with AI-powered insights.
                            Generate comprehensive questionnaires tailored to
                            your needs instantly.
                        </p>
                    </div>

                    {/* Any other links */}
                    <div className="flex flex-row gap-16 md:col-span-2">
                        {/* Quick Links */}
                        <div>
                            <h3 className="text-sm font-semibold">
                                Quick Links
                            </h3>
                            <ul className="mt-4 space-y-2">
                                <li>
                                    <Link
                                        href="/test"
                                        className="text-sm text-gray-400 hover:text-white"
                                    >
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/test"
                                        className="text-sm text-gray-400 hover:text-white"
                                    >
                                        Pricing 
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/survey/create"
                                        className="text-sm text-gray-400 hover:text-white"
                                    >
                                        Templates
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/test"
                                        className="text-sm text-gray-400 hover:text-white"
                                    >
                                        Documenation
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Legal Links */}
                        <div>
                            <h3 className="text-sm font-semibold">Legal</h3>
                            <ul className="mt-4 space-y-2">
                                <li>
                                    <Link
                                        href="/privacy"
                                        className="text-sm text-gray-400 hover:text-white"
                                    >
                                        Cookies Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/privacy"
                                        className="text-sm text-gray-400 hover:text-white"
                                    >
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/terms"
                                        className="text-sm text-gray-400 hover:text-white"
                                    >
                                        Terms of Service
                                    </Link>
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
