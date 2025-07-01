import { useState, useEffect } from 'react';
import { SurveyType } from '@/types/survey';
import { optimizeSurvey } from '@/services/optimzeSurvey';
import { GoogleFormsForm } from '@/types/GoogleFormSurvey';

type OptimizationStatus = 'idle' | 'optimizing' | 'ready' | 'error';
type OptimizedSurvey = GoogleFormsForm | SurveyType;
type PlatformKey = 'qualtrics' | 'surveymonkey' | 'googleforms';

export function useOptimization(survey: SurveyType | null, selectedPlatform: PlatformKey) {
    const [status, setStatus] = useState<OptimizationStatus>('idle');
    const [optimizedSurvey, setOptimizedSurvey] = useState<OptimizedSurvey | null>(null);
    const [isImporting, setIsImporting] = useState(false);

    useEffect(() => {
        async function optimizeSurveyForPlatform() {
            if (!survey) return;
            
            setStatus('optimizing');
            try {
                const optimized = await optimizeSurvey(
                    survey, 
                    selectedPlatform === 'googleforms' ? 'google_forms' : selectedPlatform
                );
                setOptimizedSurvey(optimized);
                setStatus('ready');
            } catch (err) {
                console.error('Optimization error:', err);
                setStatus('error');
            }
        }

        optimizeSurveyForPlatform();
    }, [survey, selectedPlatform]);

    const handleImport = async () => {
        if (!optimizedSurvey || status !== 'ready') return;
        
        try {
            setIsImporting(true);
            
            const response = await fetch('/api/survey/import/google-forms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ survey: optimizedSurvey }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 403 && data.requiresAuth) {
                    return { requiresAuth: true };
                }
                throw new Error(data.error || 'Failed to import survey');
            }

            return { url: data.url };
        } catch (err) {
            throw err;
        } finally {
            setIsImporting(false);
        }
    };

    return {
        status,
        optimizedSurvey,
        isImporting,
        handleImport
    };
}
