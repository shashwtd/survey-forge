"use client";

import React, { useEffect } from "react";
import Image from "next/image";

export default function DodgeDemo() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      const el = document.getElementById("dodge-overlay");
      if (el) {
        el.style.setProperty("--x", `${x}%`);
        el.style.setProperty("--y", `${y}%`);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <main className="w-screen h-screen bg-black relative overflow-hidden">
      {/* Base whiteish gradient background — required for color dodge to work */}
      <div className="absolute inset-0 z-0 bg-black" />

      {/* Grid PNG image with color-dodge */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Image
          unoptimized
          src="/assets/grid-max.png"
          alt="Grid"
          fill
          className="object-cover opacity-20 mix-blend-color-dodge"
        />
      </div>

      {/* Light glow following mouse */}
      <div
        id="dodge-overlay"
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at var(--x, 50%) var(--y, 50%), #ffffff 0%, transparent 40%)",
          mixBlendMode: "color-dodge",
          transition: "background 0.1s ease",
        }}
      />
    </main>
  );
}
