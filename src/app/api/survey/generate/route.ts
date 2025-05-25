import { generateSurvey } from "@/services/gemini";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { content } = await request.json();

        if (!content) {
            return NextResponse.json(
                { error: "Content is required" },
                { status: 400 }
            );
        }

        const survey = await generateSurvey(content);
        return NextResponse.json(survey);
    } catch (error) {
        console.error("Survey generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate survey" },
            { status: 500 }
        );
    }
}
