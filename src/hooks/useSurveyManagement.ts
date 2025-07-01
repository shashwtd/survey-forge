import { useState, useCallback } from 'react';
import { SurveyType } from '@/types/survey';

interface SavedSurvey {
    id: string;
    title: string;
    created_at: string;
}

export interface UseSurveyManagementReturn {
    survey: { id: string; content: SurveyType } | null;
    savedSurveys: SavedSurvey[];
    isLoading: boolean;
    error: string | null;
    fetchSurveys: () => Promise<void>;
    selectSurvey: (id: string) => Promise<void>;
    createSurvey: (content: string) => Promise<void>;
    renameSurvey: (id: string, newTitle: string) => Promise<void>;
    deleteSurvey: (id: string) => Promise<void>;
    clearSurvey: () => void;
}

export function useSurveyManagement(): UseSurveyManagementReturn {
    const [survey, setSurvey] = useState<{ id: string; content: SurveyType } | null>(null);
    const [savedSurveys, setSavedSurveys] = useState<SavedSurvey[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSurveys = useCallback(async () => {
        try {
            const response = await fetch('/api/survey/list');
            if (!response.ok) {
                throw new Error('Failed to fetch surveys');
            }
            const data = await response.json();
            setSavedSurveys(data);
        } catch (error) {
            console.error('Error fetching surveys:', error);
            setError('Failed to fetch surveys');
        }
    }, []);

    const selectSurvey = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/survey/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch survey');
            }
            const data = await response.json();
            setSurvey({ id: data.id, content: data.content });
        } catch (error) {
            console.error('Error fetching survey:', error);
            setError('Failed to fetch survey');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createSurvey = useCallback(async (content: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/survey/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });

            const data = await response.json();

            if (!response.ok) {
                let errorMessage = data.error || 'Failed to generate survey';

                if (data.code === 'SERVICE_OVERLOADED') {
                    errorMessage = 'The AI service is temporarily overloaded. Please try again in a few minutes.';
                } else if (data.code === 'PARSE_ERROR') {
                    errorMessage = 'The AI generated an invalid response. Please try again or rephrase your content.';
                } else if (data.code === 'INVALID_RESPONSE' || data.code === 'INVALID_QUESTION' || data.code === 'INVALID_OPTIONS') {
                    errorMessage = 'The generated survey was invalid. Please try again or provide more detailed content.';
                }

                throw new Error(errorMessage);
            }

            setSurvey({ id: data.id, content: data });
            await fetchSurveys();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to create survey';
            setError(message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [fetchSurveys]);

    const renameSurvey = useCallback(async (id: string, newTitle: string) => {
        setError(null);
        try {
            const response = await fetch(`/api/survey/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newTitle }),
            });

            if (!response.ok) {
                throw new Error('Failed to update survey title');
            }

            const data = await response.json();
            if (survey?.id === id) {
                setSurvey({ id: data.id, content: data.content });
            }
            await fetchSurveys();
        } catch (error) {
            console.error('Error updating survey title:', error);
            setError('Failed to update survey title');
            throw error;
        }
    }, [survey?.id, fetchSurveys]);

    const deleteSurvey = useCallback(async (id: string) => {
        setError(null);
        try {
            const response = await fetch(`/api/survey/${id}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete survey');
            }
            
            if (survey?.id === id) {
                setSurvey(null);
            }
            await fetchSurveys();
        } catch (error) {
            console.error('Error deleting survey:', error);
            setError('Failed to delete survey');
            throw error;
        }
    }, [survey?.id, fetchSurveys]);

    const clearSurvey = useCallback(() => {
        setSurvey(null);
    }, []);

    return {
        survey,
        savedSurveys,
        isLoading,
        error,
        fetchSurveys,
        selectSurvey,
        createSurvey,
        renameSurvey,
        deleteSurvey,
        clearSurvey,
    };
}
