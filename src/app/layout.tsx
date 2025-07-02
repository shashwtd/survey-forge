import type { Metadata } from "next";
import { Geist, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { SurveyProvider } from "@/context/SurveyContext";

import Footer from "@/components/Footer";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Survey Forge — AI Survey Builder",
  description:
    "Survey Forge is an AI-powered survey builder that helps you create surveys quickly and easily using AI, and allows direct imports to your desired survey platform Qualtrics or SurveyMonkey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${instrumentSans.variable} antialiased font-sans!`}
      >
        <SurveyProvider>
          <main>{children}</main>
          <Footer />
        </SurveyProvider>
      </body>
    </html>
  );
}