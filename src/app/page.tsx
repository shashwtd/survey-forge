"use client";

import React from "react";

export default function Home() {
    return (
        <main className="w-screen h-auto bg-black flex flex-col items-center justify-center">
            <section className="w-full h-[750px] pt-12 flex items-center justify-center bg-gradient-to-b from-[#070711] to-[#0f0f14]"> 
                <div className="w-full max-w-[1360px] flex flex-col items-center justify-center">
                    <h1 className="font-medium tracking-tight text-7xl leading-[1.25] font-sans max-w-3xl text-center">
                        Build & Deploy Surveys directly with <span className="text-[#00df9a]">Forge AI</span>
                    </h1>
                </div>
            </section>
        </main>
    );
}


