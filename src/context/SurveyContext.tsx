"use client";

import { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { SurveyType } from '@/types/survey';

interface SavedSurvey {
    id: string;
    title: string;
    created_at: string;
}

interface SurveyContextType {
    survey: { id: string; content: SurveyType } | null;
    savedSurveys: SavedSurvey[];
    isLoading: boolean;
    isRenamingTitle: boolean;
    isUpdatingDescription: boolean;
    error: string | null;
    fetchSurveys: () => Promise<void>;
    selectSurvey: (id: string) => Promise<void>;
    createSurvey: (content: string) => Promise<{ id: string; content: SurveyType }> ;
    renameSurvey: (id: string, newTitle: string) => Promise<void>;
    updateDescription: (id: string, newDescription: string) => Promise<void>;
    deleteSurvey: (id: string) => Promise<void>;
    clearSurvey: () => void;
}

const SurveyContext = createContext<SurveyContextType | null>(null);

export function SurveyProvider({ children }: { children: React.ReactNode }) {
    const [survey, setSurvey] = useState<{ id: string; content: SurveyType } | null>(null);
    const [savedSurveys, setSavedSurveys] = useState<SavedSurvey[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRenamingTitle, setIsRenamingTitle] = useState(false);
    const [isUpdatingDescription, setIsUpdatingDescription] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [surveysLoaded, setSurveysLoaded] = useState(false);

    const fetchSurveys = useCallback(async () => {
        if (surveysLoaded) return; // Don't fetch if we already have the list
        try {
            const response = await fetch('/api/survey/list');
            if (!response.ok) {
                throw new Error('Failed to fetch surveys');
            }
            const data = await response.json();
            setSavedSurveys(data);
            setSurveysLoaded(true);
        } catch (error) {
            console.error('Error fetching surveys:', error);
            setError('Failed to fetch surveys');
        }
    }, [surveysLoaded]);

    const selectSurvey = useCallback(async (id: string) => {
        // If we already have this survey loaded, don't fetch it again
        if (survey?.id === id) return;

        // Find the survey in our saved list to show immediately
        const savedSurvey = savedSurveys.find(s => s.id === id);
        if (savedSurvey) {
            // Set a loading state of the survey immediately
            setSurvey({
                id: savedSurvey.id,
                content: {
                    title: savedSurvey.title,
                    description: '',  // Will be updated after API call
                    questions: [],    // Will be populated after API call
                    settings: {}
                }
            });
        }

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
    }, [survey?.id, savedSurveys]);

    const createSurvey = async (content: string): Promise<{ id: string, content: SurveyType }> => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/survey/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create survey');
            }

            // Create the new survey object
            const newSurvey = {
                id: data.id,
                title: data.title,
                content: data.content,
                created_at: new Date().toISOString()
            };

            // Add new survey to the beginning of the list
            setSavedSurveys(prev => [
                {
                    id: data.id,
                    title: data.title,
                    created_at: new Date().toISOString()
                },
                ...prev
            ]);

            // Set as current survey
            setSurvey(newSurvey);

            return { id: data.id, content: data.content };
        } catch (error) {
            console.error('Error creating survey:', error);
            setError(error instanceof Error ? error.message : 'Failed to create survey');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const renameSurvey = useCallback(async (id: string, newTitle: string) => {
        setError(null);
        setIsRenamingTitle(true);
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
            setSurveysLoaded(false); // Force a refresh of the survey list
            await fetchSurveys();
        } catch (error) {
            console.error('Error updating survey title:', error);
            setError('Failed to update survey title');
            throw error;
        } finally {
            setIsRenamingTitle(false);
        }
    }, [survey?.id, fetchSurveys]);

    const updateDescription = useCallback(async (id: string, newDescription: string) => {
        setError(null);
        setIsUpdatingDescription(true);
        try {
            const response = await fetch(`/api/survey/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: newDescription }),
            });

            if (!response.ok) {
                throw new Error('Failed to update survey description');
            }

            const data = await response.json();
            if (survey?.id === id) {
                setSurvey({ id: data.id, content: data.content });
            }
        } catch (error) {
            console.error('Error updating survey description:', error);
            setError('Failed to update survey description');
            throw error;
        } finally {
            setIsUpdatingDescription(false);
        }
    }, [survey?.id]);

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
            setSurveysLoaded(false); // Force a refresh of the survey list
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

    // Initial survey list load
    useEffect(() => {
        fetchSurveys();
    }, [fetchSurveys]);

    return (
        <SurveyContext.Provider value={{
            survey,
            savedSurveys,
            isLoading,
            isRenamingTitle,
            isUpdatingDescription,
            error,
            fetchSurveys,
            selectSurvey,
            createSurvey,
            renameSurvey,
            updateDescription,
            deleteSurvey,
            clearSurvey,
        }}>
            {children}
        </SurveyContext.Provider>
    );
}

export function useSurveyContext() {
    const context = useContext(SurveyContext);
    if (!context) {
        throw new Error('useSurveyContext must be used within a SurveyProvider');
    }
    return context;
}