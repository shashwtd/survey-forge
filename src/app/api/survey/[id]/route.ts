import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = await Promise.resolve(params);
    try {
        // Initialize Supabase client
        const supabase = await createClient();

        // Check if user is authenticated using getUser()
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        // Get survey by ID
        const { data: survey, error } = await supabase
            .from('surveys')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('[Survey Get] Database error:', error);
            return NextResponse.json(
                {
                    error: "Failed to fetch survey",
                    code: "DB_ERROR"
                },
                { status: 500 }
            );
        }

        if (!survey) {
            return NextResponse.json(
                { error: "Survey not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(survey);
    } catch (error) {
        console.error("[Survey Get] Unexpected error:", error);
        return NextResponse.json(
            {
                error: "An unexpected error occurred while fetching the survey",
                code: "UNKNOWN_ERROR",
            },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = await Promise.resolve(params);
    try {
        // Initialize Supabase client
        const supabase = await createClient();

        // Check if user is authenticated using getUser()
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        // Delete survey by ID
        const { error } = await supabase
            .from('surveys')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            console.error('[Survey Delete] Database error:', error);
            return NextResponse.json(
                {
                    error: "Failed to delete survey",
                    code: "DB_ERROR"
                },
                { status: 500 }
            );
        }

        return NextResponse.json({ message: "Survey deleted successfully" });
    } catch (error) {
        console.error("[Survey Delete] Unexpected error:", error);
        return NextResponse.json(
            {
                error: "An unexpected error occurred while deleting the survey",
                code: "UNKNOWN_ERROR",
            },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = await Promise.resolve(params);
    try {
        // Initialize Supabase client
        const supabase = await createClient();

        // Check if user is authenticated using getUser()
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        // Get the updated data from request body
        const body = await request.json();
        const { title, description } = body;

        if (!title && !description) {
            return NextResponse.json(
                { error: "Title or description is required" },
                { status: 400 }
            );
        }

        // First get the current survey
        const { data: currentSurvey, error: fetchError } = await supabase
            .from('surveys')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (fetchError || !currentSurvey) {
            return NextResponse.json(
                { error: "Survey not found" },
                { status: 404 }
            );
        }

        // Update survey with new title/description and preserve the ID
        const updatedContent = {
            ...currentSurvey.content,
            id,  // Explicitly preserve the ID
            ...(title && { title }),
            ...(description && { description })
        };

        // Update survey with new data
        const { data: survey, error } = await supabase
            .from('surveys')
            .update({ 
                content: updatedContent,
                ...(title && { title }), // Only update title field if title is provided
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('user_id', user.id)
            .select('*')
            .single();

        if (error) {
            console.error('[Survey Update] Database error:', error);
            return NextResponse.json(
                {
                    error: "Failed to update survey",
                    code: "DB_ERROR"
                },
                { status: 500 }
            );
        }

        // Return the content with the ID preserved
        return NextResponse.json({
            ...survey,
            content: updatedContent
        });
    } catch (error) {
        console.error("[Survey Update] Unexpected error:", error);
        return NextResponse.json(
            {
                error: "An unexpected error occurred while updating the survey",
                code: "UNKNOWN_ERROR",
            },
            { status: 500 }
        );
    }
}