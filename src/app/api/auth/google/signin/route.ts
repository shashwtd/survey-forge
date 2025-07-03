import { NextRequest, NextResponse } from "next/server";
import { google } from 'googleapis';

export async function GET(request: NextRequest) {
    try {
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );

        // Get the referer URL path to return to after auth
        const referer = request.headers.get('referer');
        let returnPath = '/survey/create';
        if (referer) {
            try {
                const url = new URL(referer);
                returnPath = url.pathname + url.search;
            } catch (e) {
                console.error('Failed to parse referer URL:', e);
            }
        }

        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/forms',
                'https://www.googleapis.com/auth/drive.file'
            ],
            prompt: 'consent',
            state: returnPath // Pass the return path in state parameter
        });

        return NextResponse.redirect(authUrl);
    } catch (error) {
        console.error('Failed to generate auth URL:', error);
        return NextResponse.redirect('/survey/create?error=auth_failed');
    }
}
