import { createClient } from '@/utils/supabase/client';

export const GOOGLE_SCOPES = [
    'https://www.googleapis.com/auth/forms',
    'https://www.googleapis.com/auth/drive.file'
];

export interface GoogleTokens {
    user_id: string;
    access_token: string;
    refresh_token: string;
    expires_at: number;
}

export async function signInWithGoogle() {
    window.location.href = `/api/auth/google/signin`;
}

export async function getGoogleTokens(): Promise<GoogleTokens | null> {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return null;

    const { data: tokens, error } = await supabase
        .from('user_google_tokens')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

    if (error) {
        console.error('Error fetching tokens:', error);
        return null;
    }

    return tokens;
}
