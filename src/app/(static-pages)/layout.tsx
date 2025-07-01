"use client";

import Header from "@/components/Header";

export default function StaticPagesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            {children}
        </>
    );
}
