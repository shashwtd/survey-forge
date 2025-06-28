import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';
import { google } from 'googleapis';

export async function GET(request: NextRequest) {
    // Create base URL for redirects
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const host = request.headers.get('host');
    const baseUrl = `${protocol}://${host}`;

    try {
        const searchParams = request.nextUrl.searchParams;
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
            console.error('Google OAuth error:', error);
            return NextResponse.redirect(`${baseUrl}/dashboard?error=auth_failed`);
        }
        
        if (!code) {
            return NextResponse.redirect(`${baseUrl}/dashboard?error=no_code`);
        }

        // Get Supabase client
        const supabase = await createClient();

        // Get authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            console.error('Auth error:', userError);
            return NextResponse.redirect(`${baseUrl}/login?error=no_session`);
        }

        // Set up OAuth2 client
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );

        // Exchange code for tokens
        const { tokens } = await oauth2Client.getToken(code);

        if (!tokens.access_token || !tokens.refresh_token) {
            console.error('Failed to get tokens');
            return NextResponse.redirect(`${baseUrl}/dashboard?error=no_tokens`);
        }

        // Calculate expiration time
        const expiresAt = tokens.expiry_date;

        // Store tokens in Supabase
        const { error: tokenError } = await supabase
            .from('user_google_tokens')
            .upsert({
                user_id: user.id,
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                expires_at: expiresAt
            });

        if (tokenError) {
            console.error('Failed to store tokens:', tokenError);
            return NextResponse.redirect(`${baseUrl}/dashboard?error=token_storage_failed`);
        }

        return NextResponse.redirect(`${baseUrl}/dashboard?success=connected`);
    } catch (error) {
        console.error('Google OAuth error:', error);
        return NextResponse.redirect(`${baseUrl}/dashboard?error=auth_failed`);
    }
}
