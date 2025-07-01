import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getGoogleTokens, signInWithGoogle } from '@/utils/google-auth';

export function useGoogleAuth() {
    const [authStatus, setAuthStatus] = useState<'none' | 'success' | 'error'>('none');
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        const errorParam = searchParams.get('error');
        const success = searchParams.get('success');
        
        if (errorParam) {
            setError(
                errorParam === 'google_auth_failed' ? 'Google authentication failed' :
                errorParam === 'forms_access_denied' ? 'Access to Google Forms was denied' :
                'Failed to connect to Google'
            );
            setAuthStatus('error');
        } else if (success === 'connected') {
            setAuthStatus('success');
        }
    }, [searchParams]);

    const handleGoogleAuth = async () => {
        const tokens = await getGoogleTokens();
        if (!tokens) {
            await signInWithGoogle();
            return false;
        }
        return true;
    };

    const handleConnect = () => {
        window.location.href = '/api/auth/google/signin';
    };

    return {
        authStatus,
        error,
        handleGoogleAuth,
        handleConnect
    };
}
