import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Initialize Supabase client
        const supabase = await createClient();

        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        // Get survey by ID
        const { data: survey, error } = await supabase
            .from('surveys')
            .select('*')
            .eq('id', params.id)
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
    try {
        // Initialize Supabase client
        const supabase = await createClient();

        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        // Delete survey by ID
        const { error } = await supabase
            .from('surveys')
            .delete()
            .eq('id', params.id)
            .eq('user_id', session.user.id);

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