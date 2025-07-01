import { generateSurvey, GeminiServiceError } from "@/services/gemini";
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
        // Log the error details for debugging
        if (error instanceof GeminiServiceError) {
            console.error(
                `[Survey Generation] ${error.code} (${error.status}): ${error.message}`
            );
        } else {
            console.error("[Survey Generation] Unexpected error:", error);
        }

        // Return appropriate error response to client
        if (error instanceof GeminiServiceError) {
            return NextResponse.json(
                {
                    error: error.message,
                    code: error.code,
                },
                { status: error.status || 500 }
            );
        }

        return NextResponse.json(
            {
                error: "An unexpected error occurred while generating the survey",
                code: "UNKNOWN_ERROR",
            },
            { status: 500 }
        );
    }
}
