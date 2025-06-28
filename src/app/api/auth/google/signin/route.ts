import { NextResponse } from "next/server";
import { google } from 'googleapis';

export async function GET() {
    try {
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );

        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/forms',
                'https://www.googleapis.com/auth/drive.file'
            ],
            prompt: 'consent'
        });

        return NextResponse.redirect(authUrl);
    } catch (error) {
        console.error('Failed to generate auth URL:', error);
        return NextResponse.redirect('/dashboard?error=auth_failed');
    }
}
