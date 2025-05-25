export interface SurveyQuestion {
    id: string;
    question: string;
    type: 'multiple_choice' | 'text' | 'rating';
    options?: string[];
}

export interface Survey {
    title: string;
    description: string;
    questions: SurveyQuestion[];
}
