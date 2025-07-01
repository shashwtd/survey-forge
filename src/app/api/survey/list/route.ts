import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
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

        // Get surveys for the current user, ordered by creation date
        const { data: surveys, error } = await supabase
            .from('surveys')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[Survey List] Database error:', error);
            return NextResponse.json(
                {
                    error: "Failed to fetch surveys",
                    code: "DB_ERROR"
                },
                { status: 500 }
            );
        }

        return NextResponse.json(surveys);
    } catch (error) {
        console.error("[Survey List] Unexpected error:", error);
        return NextResponse.json(
            {
                error: "An unexpected error occurred while fetching surveys",
                code: "UNKNOWN_ERROR",
            },
            { status: 500 }
        );
    }
}
