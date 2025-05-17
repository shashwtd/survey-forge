"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LucideBookOpen } from "lucide-react";

export default function Home() {
    return (
        <main className="w-screen h-auto bg-black flex flex-col items-center justify-center">
            <section className="w-full h-[750px] pt-12 flex flex-col items-center justify-center bg-gradient-to-b from-[#070711] to-[#0f0f14] relative overflow-hidden">
                <div
                    className="absolute w-screen h-auto aspect-video top-0 bg-cover opacity-10 max-w-[1536px]"
                    style={{
                        backgroundImage: "url(/assets/grid_pattern.png)",
                        backgroundPosition: "center -48px",
                    }}
                ></div>

                {/* Light beams container limited to 1440px */}
                <div className="absolute w-full max-w-[1560px] h-full left-1/2 transform -translate-x-1/2 pointer-events-none overflow-visible">
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

                <div className="w-full max-w-[1360px] flex flex-col items-center justify-center z-10">
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
                <div className="flex items-center justify-center w-max h-max mt-12 z-10">
                    <div className="flex gap-4 mt-8">
                        <Link href="/documentation" className="flex rounded-full items-center justify-center  gap-3  px-6 py-2 scale-y-[0.99] bg-white/5 hover:bg-white/7 text-white/80 text-xl font-medium border border-white/15 duration-300">
                            <LucideBookOpen size={18} className="mt-0.5 opacity-75" />
                            Read Docs
                        </Link>
                        <Link href="/dashboard" className="group rounded-full cursor-pointer flex items-center justify-center gap-3  px-6 pb-2.5 pt-2 bg-[#3f4da8] hover:bg-[#28368f] duration-300 text-white text-xl font-medium">
                            Create Survey
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                className="size-5 group-hover:translate-x-1.5 mt-1 duration-200"
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
        </main>
    );
}
