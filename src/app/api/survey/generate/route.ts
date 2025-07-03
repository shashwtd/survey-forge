import { generateSurvey, GeminiServiceError } from "@/services/gemini";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
    try {
        // Initialize Supabase client
        const supabase = await createClient();

        // Check if user is authenticated
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const { content } = await request.json();

        if (!content) {
            return NextResponse.json(
                { error: "Content is required" },
                { status: 400 }
            );
        }

        const surveyContent = await generateSurvey(content);

        // Save the survey to the database
        const { data: savedSurvey, error: saveError } = await supabase
            .from("surveys")
            .insert([
                {
                    user_id: user.id,
                    content: surveyContent,
                    // Generate a title from the first question or use the survey title
                    title:
                        surveyContent.title ||
                        surveyContent.questions?.[0]?.question?.slice(0, 100) ||
                        "Untitled Survey",
                },
            ])
            .select()
            .single();

        if (saveError) {
            console.error("[Survey Save] Database error:", saveError);
            return NextResponse.json(
                {
                    error: "Failed to save survey",
                    code: "DB_ERROR",
                },
                { status: 500 }
            );
        }

        console.log("NEW SURVEY CREATED:", savedSurvey, savedSurvey.id);

        // Return both the ID and the content
        return NextResponse.json({
            id: savedSurvey.id,
            content: surveyContent,
            title: savedSurvey.title,
        });
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
