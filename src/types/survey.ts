export interface SurveyQuestion {
    id: string;
    question: string;
    type: QuestionType;
    required: boolean;
    description?: string;
    options?: string[];
    settings?: {
        allowOther?: boolean;
        minRating?: number;
        maxRating?: number;
        ratingLabels?: {
            min?: string;
            max?: string;
        };
        validation?: {
            min?: number;
            max?: number;
            pattern?: string;
        };
    };
}

export type QuestionType = 
    | 'multiple_choice'  // Single selection
    | 'checkbox'         // Multiple selection
    | 'text'            // Short answer
    | 'paragraph'       // Long answer
    | 'rating'          // Linear scale
    | 'dropdown'        // Dropdown selection
    | 'date'            // Date picker
    | 'time'            // Time picker
    | 'email'           // Email input
    | 'number';         // Numeric input

export interface SurveyType {
    title: string;
    description: string;
    settings: {
        collectEmail?: boolean;
        confirmationMessage?: string;
        allowMultipleResponses?: boolean;
    };
    questions: SurveyQuestion[];
}
