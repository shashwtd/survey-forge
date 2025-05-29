"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { LucideBookOpen, Trophy } from "lucide-react";
import gsap from "gsap";
import { SlowMo } from "gsap/all";

gsap.registerPlugin(SlowMo);

const FeatureCard = ({
    title,
    subtitle,
    description,
    icon: Icon,
    features,
    color,
}: {
    title: string;
    subtitle: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    features: string[];
    color: "yellow" | "blue" | "orange";
}) => {
    const colorMap = {
        yellow: "from-yellow-400/20 to-yellow-400/5 border-yellow-400/20 text-yellow-400/90",
        blue: "from-blue-400/20 to-blue-400/5 border-blue-400/20 text-blue-400/90",
        orange: "from-orange-400/20 to-orange-400/5 border-orange-400/20 text-orange-400/90",
    };

    return (
        <div className="group relative select-none">
            <div
                className={`absolute inset-0 bg-gradient-to-r ${colorMap[color]
                    .replace("from-", "from-")
                    .replace(
                        "to-",
                        "to-"
                    )} rounded-3xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`}
            ></div>
            <div className="relative flex flex-col gap-6 p-8 rounded-3xl bg-white/6 border border-white/8 backdrop-blur-sm hover:bg-white/[0.05] transition-all duration-300">
                <div className="flex items-center gap-4">
                    <div
                        className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-b ${colorMap[color]}`}
                    >
                        <Icon className="size-7" />
                    </div>
                    <div>
                        <h3 className="text-xl font-medium text-white/90 font-instrument-sans">
                            {title}
                        </h3>
                        <p className="text-white/40 font-geist">{subtitle}</p>
                    </div>
                </div>
                <p className="text-white/60 font-geist leading-relaxed">
                    {description}
                </p>
                <ul className="space-y-3">
                    {features.map((feature, index) => (
                        <li
                            key={index}
                            className="flex items-center gap-3 text-sm text-white/50"
                        >
                            <svg
                                className={`size-5 ${colorMap[color]}`}
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M7 12L10.5 15.5L17 9"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default function Home() {
    const surveyPreviewRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Survey preview floating animation
            gsap.to(surveyPreviewRef.current, {
                y: 20,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
            });

            // Stats reveal animation
            gsap.from(statsRef.current?.children || [], {
                opacity: 0,
                y: 20,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out",
                delay: 0.5,
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <main className="w-screen h-auto bg-black flex flex-col items-center justify-center">
            <section className="w-full bg-[#0a0a0a] h-screen max-h-[720px] flex flex-col items-center justify-center relative overflow-hidden pt-12">
                {/* Background gradient with blur */}
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-transparent backdrop-blur-[100px] pointer-events-none"></div>

                {/* Light beams container limited to 1440px */}
                <div className="absolute w-full max-w-[1560px] h-full left-1/2 transform -translate-x-1/2 -top-8 pointer-events-none overflow-visible">
                    {/* Left light beam */}
                    <div className="absolute -left-20 w-max h-max overflow-visible">
                        <Image
                            unoptimized
                            width={550}
                            height={430}
                            src="/assets/light_beam_towards_right.svg"
                            alt="Light beam left"
                            className="w-full h-full object-cover z-0"
                        />
                    </div>

                    {/* Right light beam */}
                    <div className="absolute -right-20 w-max h-max overflow-visible scale-x-[-1]">
                        <Image
                            unoptimized
                            width={550}
                            height={430}
                            src="/assets/light_beam_towards_right.svg"
                            alt="Light beam right"
                            className="w-full h-full object-cover z-0"
                        />
                    </div>
                </div>
                {/* Light beams container limited to 1440px */}
                <div className="absolute w-full max-w-[1560px] h-full left-1/2 transform -translate-x-1/2 pointer-events-none overflow-visible">
                    {/* Left light beam */}
                    <div className="absolute left-48 w-max h-max overflow-visible">
                        <Image
                            unoptimized
                            width={550}
                            height={430}
                            src="/assets/light_beam_towards_right.svg"
                            alt="Light beam left"
                            className="w-full h-full object-cover z-0"
                        />
                    </div>

                    {/* Right light beam */}
                    <div className="absolute right-48 w-max h-max overflow-visible scale-x-[-1]">
                        <Image
                            unoptimized
                            width={550}
                            height={430}
                            src="/assets/light_beam_towards_right.svg"
                            alt="Light beam right"
                            className="w-full h-full object-cover z-0"
                        />
                    </div>
                </div>

                <div className="w-full cursor-default max-w-[1360px] flex flex-col items-center justify-center z-10">
                    <h1
                        className="font-medium tracking-tight text-4xl lg:text-7xl font-instrument-sans max-w-4xl text-center"
                        style={{
                            background:
                                "linear-gradient(180deg, #FFF 0%, #999 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        Build & Deploy your Surveys
                    </h1>
                    <h1
                        className="font-medium tracking-tight text-4xl lg:text-7xl font-instrument-sans max-w-4xl text-center pb-1 mt-2"
                        style={{
                            background:
                                "linear-gradient(180deg, #FFF 0%, #999 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        directly with{" "}
                        <span className="bg-[#A3B0FF] bg-clip-text ">
                            Forge AI
                        </span>
                    </h1>
                    <h4 className="text-[22px] text-white/60 font-sans max-w-[650px] mt-8 text-center">
                        Survey Forge helps generation of surveys with AI. It
                        promises ideal questions, contentful connections and
                        ease of use
                    </h4>
                </div>
                <div className="flex flex-col items-center justify-center w-full h-max mt-12 z-10">
                    <div className="flex gap-4 mt-8">
                        <Link
                            href="/documentation"
                            className="group flex backdrop-blur-sm rounded-full items-center justify-center gap-3 px-6 py-2 scale-y-[0.99] bg-white/5 hover:bg-white/10 text-white/80 hover:text-white/90 text-xl font-medium border border-white/15 transition-all duration-300 relative overflow-hidden"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                            <LucideBookOpen
                                size={18}
                                className="mt-0.5 opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-300"
                            />
                            <span className="relative">Read Docs</span>
                        </Link>
                        <Link
                            href="/app"
                            className="group rounded-full cursor-pointer flex items-center justify-center gap-3 px-6 pb-2.5 pt-2 text-white text-xl font-medium shadow-lg border border-indigo-600/20 transition-all duration-300 relative overflow-hidden"
                            style={{
                                background:
                                    "linear-gradient(to right, #4f5db8, #2a3292)",
                            }}
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-400/40 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                            Create Survey
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                className="size-5 group-hover:translate-x-1.5 mt-1 delay-300 duration-200"
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
            </section>

            {/* Features Section */}
            <section className="w-full py-24 bg-gradient-to-b from-black to-neutral-950 pb-40 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/assets/grid_pattern.png')] bg-no-repeat bg-[center_top] opacity-20"></div>
                <div className="max-w-[1200px] mx-auto px-4">
                    <div className="flex flex-col items-center justify-center pb-12 gap-4">
                        <p className="text-white/50 font-sans text-base text-center max-w-3xl mx-auto">
                            FEATURES
                        </p>

                        <h2 className="font-medium tracking-tighter text-4xl lg:text-5xl font-sans text-white/90 text-center">
                            Why Forge AI?
                        </h2>
                    </div>

                    <p className="text-white/60 font-geist text-xl text-center max-w-3xl mx-auto mb-20"></p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            title="AI-Powered"
                            subtitle="Smart Generation"
                            description="Our advanced AI understands context and creates surveys that capture exactly what you need. No more starting from scratch or adapting templates."
                            icon={Trophy}
                            color="yellow"
                            features={[
                                "Context-aware question generation",
                                "Smart answer options",
                                "Automatic survey flow optimization",
                            ]}
                        />

                        <FeatureCard
                            title="Free to Start"
                            subtitle="No Credit Card"
                            description="Get started immediately with our free tier. Create and deploy surveys without any upfront commitment. Upgrade only when you need more."
                            icon={({ className }: { className?: string }) => (
                                <svg
                                    className={className}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M22 2L13.5 10.5"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M19 2H22V5"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            )}
                            color="blue"
                            features={[
                                "3 active surveys",
                                "Basic analytics",
                                "Export to common formats",
                            ]}
                        />

                        <FeatureCard
                            title="24/7 Support"
                            subtitle="Discord Community"
                            description="Join our vibrant Discord community for instant support, tips, and collaboration. Our team and community are always here to help."
                            icon={({ className }: { className?: string }) => (
                                <svg
                                    className={className}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M21.0001 12.07V13C20.9975 15.2144 20.2042 17.3556 18.7704 19.0892C17.3366 20.8227 15.3466 22.0564 13.1449 22.5947C10.9432 23.1331 8.63312 22.9461 6.53984 22.0591C4.44656 21.1721 2.69644 19.6354 1.55972 17.6988C0.422996 15.7622 -0.0612131 13.522 0.19494 11.2978C0.451093 9.07358 1.43829 6.98558 3.0091 5.32141C4.57992 3.65724 6.64058 2.50505 8.89043 2.04965C11.1403 1.59425 13.4574 1.85878 15.5401 2.80007"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M22 4L11 15L8 12"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            )}
                            color="orange"
                            features={[
                                "Active Discord community",
                                "Fast response times",
                                "Regular community events",
                            ]}
                        />
                    </div>
                </div>
            </section>

        </main>
    );
}
