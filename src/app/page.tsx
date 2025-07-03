"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { LucideLogIn, Trophy } from "lucide-react";
import Header from "@/components/Header";
import gsap from "gsap";
import { SlowMo, ScrollTrigger, SplitText } from "gsap/all";
import Lenis from "@studio-freight/lenis";

gsap.registerPlugin(SlowMo, ScrollTrigger, SplitText);

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
        yellow: "from-indigo-500 to-blue-600 border-indigo-500/20 text-indigo-400",
        blue: "from-blue-500 to-indigo-600 border-blue-500/20 text-blue-400",
        orange: "from-violet-500 to-purple-600 border-violet-500/20 text-violet-400",
        purple: "from-purple-500 to-indigo-600 border-purple-500/20 text-purple-400",
    };

    const gradientMap = {
        yellow: "circle at 240px 30px, rgba(99, 102, 241, 0.3) 0%, #202020 40%, #202020 100%",
        blue: "circle at 60% 0%, rgba(59, 130, 246, 0.3) 0%, #202020 40%, #202020 100%",
        orange: "circle at 90% 50%, rgba(139, 92, 246, 0.3) 0%, #202020 25%, #202020 100%",
        purple: "circle at 30% 50%, rgba(168, 85, 247, 0.3) 0%, #202020 35%, #202020 100%",
    };

    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = React.useState(false);
    const cardRef = React.useRef<HTMLDivElement>(null);
    const titleRef = React.useRef<HTMLHeadingElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const iconRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: "top bottom-=100px",
                },
            });

            // Split title text into characters
            const splitTitle = new SplitText(titleRef.current, {
                type: "chars,words",
            });
            if (contentRef.current) {
                tl.from(cardRef.current, {
                    borderOpacity: 0,
                    duration: 1.2,
                    ease: "power2.out",
                })
                    .from(
                        splitTitle.chars,
                        {
                            opacity: 0,
                            y: 20,
                            rotateX: -90,
                            stagger: 0.02,
                            duration: 0.8,
                            ease: "back.out(2)",
                        },
                        "-=1.2"
                    )
                    .from(
                        contentRef.current.querySelector("p"),
                        {
                            y: 15,
                            opacity: 0,
                            duration: 0.8,
                            ease: "power2.out",
                        },
                        "-=0.7"
                    )
                    .from(
                        contentRef.current.querySelectorAll("li"),
                        {
                            y: 20,
                            opacity: 0,
                            stagger: 0.1,
                            duration: 0.5,
                            ease: "power2.out",
                        },
                        "-=0.7"
                    );

                gsap.to(iconRef.current, {
                    y: 5,
                    duration: 3,
                    repeat: -1,
                    yoyo: true,
                    ease: "power1.inOut",
                });
            }
        });

        return () => ctx.revert();
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="p-[1px] rounded-[40px] h-full relative group"
            style={{
                background: isHovered
                    ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%), radial-gradient(${gradientMap[color]})`
                    : `radial-gradient(${gradientMap[color]})`,
                transition: "background 0.2s",
            }}
        >
            <div className="rounded-[40px] w-full h-full overflow-hidden">
                <div className="flex flex-col h-full w-full bg-[#0e0e0e] relative p-8">
                    <div className="flex justify-between items-start mb-6">
                        <span className="text-base font-medium text-white/40">
                            {subtitle}
                        </span>
                        <div ref={iconRef} className="relative">
                            <div
                                className={`absolute inset-0 opacity-30 blur-xl rounded-full bg-gradient-to-b ${colorMap[color]}`}
                            />
                            <div className="flex items-center justify-center w-16 h-16 rounded-2xl relative transition-all duration-300 hover:scale-105 hover:rotate-[-3deg] backdrop-blur-sm bg-black/20">
                                <Icon className="size-8 text-white/70" />
                            </div>
                        </div>
                    </div>
                    <div ref={contentRef} className="z-20 w-full">
                        <h3
                            ref={titleRef}
                            className="text-2xl text-[#cccccc] font-instrument font-semibold tracking-tight mb-2.5"
                        >
                            {title}
                        </h3>
                        <p className="text-base text-[#666666] tracking-[-0.18px] mb-6">
                            {description}
                        </p>
                        <ul className="space-y-3">
                            {features.map((feature, index) => (
                                <li
                                    key={index}
                                    className="flex items-center gap-3 text-sm text-[#666666]"
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
            </div>
        </div>
    );
};

export default function Home() {
    const heroRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const subtitleRef = useRef<HTMLDivElement>(null);
    const descriptionRef = useRef<HTMLDivElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);
    const surveyPreviewRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Connect Lenis to GSAP ScrollTrigger
        lenis.on("scroll", ScrollTrigger.update);

        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            // Hero elements animation
            tl.fromTo(
                titleRef.current,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power2.in" }
            )
                .fromTo(
                    subtitleRef.current,
                    { opacity: 0, y: -20 },
                    { opacity: 1, y: 0, duration: 0.8, ease: "power2.in" },
                    "-=0.6"
                )
                .fromTo(
                    descriptionRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.6, ease: "power2.in" },
                    "-=0.4"
                )
                .fromTo(
                    buttonsRef.current,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" },
                    "-=0.4"
                );

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

            return () => {
                lenis.destroy();
            };
        });

        return () => ctx.revert();
    }, []);

    return (
        <>
            <Header />
            <main className="w-screen h-auto flex flex-col items-center justify-center pb-12 bg-[#0a0a0a]">
                <section className="w-full bg-[#0a0a0a] min-h-[90vh] md:h-screen md:max-h-[800px] flex flex-col items-center justify-center relative overflow-hidden">
                    {/* Background grid and gradient */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            unoptimized
                            quality={100}
                            src="/assets/grid_pattern.png"
                            alt="Grid Pattern"
                            className="pt-80 bg-[#0a0a0a] opacity-20"
                            fill
                            sizes="100vw"
                            style={{
                                objectFit: "cover",
                            }}
                        />
                        <div className="absolute w-full max-w-screen-lg h-16 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 blur-[250px] top-2/3 left-1/2 -translate-x-1/2" />
                    </div>

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

                    <div
                        ref={heroRef}
                        className="w-full max-w-[1360px] flex flex-col items-center justify-center z-20 px-4 relative"
                    >
                        <h1
                            ref={titleRef}
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
                            ref={subtitleRef}
                            className="font-medium tracking-tight text-4xl lg:text-7xl font-instrument-sans max-w-4xl text-center pb-1 mt-2"
                            style={{
                                background:
                                    "linear-gradient(180deg, #FFF 0%, #999 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            directly with
                            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent ml-2">
                                Forge AI
                            </span>
                        </h1>
                        <h4
                            ref={descriptionRef}
                            className="text-[22px] text-white/60 font-sans max-w-[650px] mt-8 text-center"
                        >
                            Survey Forge helps generation of surveys with AI. It
                            promises ideal questions, contentful connections and
                            ease of use
                        </h4>

                        <div
                            ref={buttonsRef}
                            className="flex flex-col md:flex-row gap-4 md:gap-8 items-center justify-center mt-12"
                        >
                            <Link
                                href="/login"
                                className="group flex backdrop-blur-sm rounded-full items-center justify-center gap-3 px-6 py-2 scale-y-[0.99] bg-white/5 hover:bg-white/10 text-white/80 hover:text-white/90 text-xl font-medium border border-white/15 transition-all duration-300 relative overflow-hidden"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                                <LucideLogIn
                                    size={18}
                                    className="mt-0.5 opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                                />
                                <span className="relative">Sign in</span>
                            </Link>
                            <Link
                                href="/survey/create"
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
                                        stroke="#fff"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 12h14m0 0-6-6m6 6-6 6"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="w-full py-20 bg-gradient-to-b from-black to-neutral-950 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/assets/grid_pattern.png')] bg-no-repeat bg-[center_top] opacity-20"></div>
                    <div className="container mx-auto mb-14 px-4">
                        <div className="text-center">
                            <p className="font-instrument font-medium text-lg text-neutral-500">
                                PLATFORM BENEFITS
                            </p>
                            <h2 className="mt-3 text-3xl md:text-5xl font-medium max-w-2xl mx-auto text-white/90 font-instrument mb-4 tracking-tight">
                                Why Choose Forge AI?
                            </h2>
                        </div>
                    </div>

                    <div className="max-w-[1080px] mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <FeatureCard
                                title="AI-Powered Generation"
                                subtitle="Smart AI"
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
                                title="Full Customization"
                                subtitle="Design"
                                description="Complete control over your survey's look and feel. Create branching logic, add custom themes, and design the perfect flow for your respondents."
                                icon={({
                                    className,
                                }: {
                                    className?: string;
                                }) => (
                                    <svg
                                        className={className}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M12 3L20 7V17L12 21L4 17V7L12 3Z"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M12 12L20 7"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M12 12L4 7"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M12 12V21"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                )}
                                color="blue"
                                features={[
                                    "Custom branding and themes",
                                    "Advanced logic flows",
                                    "Rich media support",
                                ]}
                            />

                            <FeatureCard
                                title="24/7 Support"
                                subtitle="Community"
                                description="Join our vibrant Discord community for instant support, tips, and collaboration. Our team and community are always here to help."
                                icon={({
                                    className,
                                }: {
                                    className?: string;
                                }) => (
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

                            <FeatureCard
                                title="Free to Start"
                                subtitle="No Credit Card"
                                description="Get started immediately with our free tier. Create and deploy surveys without any upfront commitment. Upgrade only when you need more."
                                icon={({
                                    className,
                                }: {
                                    className?: string;
                                }) => (
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
                                color="yellow"
                                features={[
                                    "3 active surveys",
                                    "Basic analytics",
                                    "Export to common formats",
                                ]}
                            />
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
