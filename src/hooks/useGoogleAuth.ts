import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getGoogleTokens, signInWithGoogle } from '@/utils/google-auth';

export function useGoogleAuth() {
    const [authStatus, setAuthStatus] = useState<'none' | 'success' | 'error'>('none');
    const [error, setError] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(true);
    const searchParams = useSearchParams();

    useEffect(() => {
        const checkAuth = async () => {
            setIsChecking(true);
            try {
                // First check if we have tokens
                const tokens = await getGoogleTokens();
                if (tokens) {
                    setAuthStatus('success');
                    return;
                }

                // If no tokens, check URL params for auth flow result
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
                } else {
                    setAuthStatus('none');
                }
            } catch (e) {
                console.error('Error checking auth status:', e);
                setAuthStatus('error');
                setError('Failed to check authentication status');
            } finally {
                setIsChecking(false);
            }
        };

        checkAuth();
    }, [searchParams]);

    const handleGoogleAuth = async () => {
        const tokens = await getGoogleTokens();
        if (!tokens) {
            await signInWithGoogle();
            return false;
        }
        setAuthStatus('success');
        return true;
    };

    const handleConnect = () => {
        signInWithGoogle();
    };

    return {
        authStatus,
        error,
        isChecking,
        handleGoogleAuth,
        handleConnect
    };
}
