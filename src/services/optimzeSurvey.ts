/*

This service is used to optimize the survey data according to the selected
survey platform for more compatibility and ease of use.

*/

import { SurveyType, SurveyQuestion } from "@/types/survey";
import { GoogleFormsForm, GoogleFormsItem } from "@/types/GoogleFormSurvey";

// The main function
export async function optimizeSurvey(
    survey: SurveyType | null,
    platform: "google_forms" | "qualtrics" | "surveymonkey"
): Promise<SurveyType | GoogleFormsForm> {
    if (!survey) {
        throw new Error("Survey data is required");
    }

    try {
        if (platform === "google_forms") {
            return convertToGoogleForms(survey);
        } else if (platform === "qualtrics") {
            return await optimizeForQualtrics(survey);
        } else if (platform === "surveymonkey") {
            return await optimizeForSurveyMonkey(survey);
        }
        return survey; // Return original survey for unsupported platforms
    } catch (error) {
        console.error("Error optimizing survey:", error);
        throw error;
    }
}

function mapQuestionTypeToGoogleForms(type: string): {
    textQuestion?: { paragraph: boolean };
    choiceQuestion?: {
        type: "RADIO" | "CHECKBOX" | "DROP_DOWN";
        options: Array<{ value: string }>;
    };
    scaleQuestion?: {
        low: number;
        high: number;
        lowLabel?: string;
        highLabel?: string;
    };
    dateQuestion?: {
        includeTime?: boolean;
        includeYear?: boolean;
    };
    timeQuestion?: {
        duration?: boolean;
    };
    sectionHeader?: {
        title: string;
        description?: string;
    };
} {
    switch (type) {
        case 'text':
            return { textQuestion: { paragraph: false } };
        case 'paragraph':
            return { textQuestion: { paragraph: true } };
        case 'multiple_choice':
            return { choiceQuestion: { type: "RADIO", options: [] } };
        case 'checkbox':
            return { choiceQuestion: { type: "CHECKBOX", options: [] } };
        case 'dropdown':
            return { choiceQuestion: { type: "DROP_DOWN", options: [] } };
        case 'rating':
            return {
                scaleQuestion: {
                    low: 1,
                    high: 5,
                    lowLabel: "Lowest",
                    highLabel: "Highest"
                }
            };
        case 'date':
            return { dateQuestion: { includeYear: true } };
        case 'time':
            return { timeQuestion: { duration: false } };
        case 'section':
            return { sectionHeader: { title: "" } }; // Empty title will be replaced in convertToGoogleFormsItem
        default:
            return { textQuestion: { paragraph: false } };
    }
}

function convertToGoogleFormsItem(question: SurveyQuestion): GoogleFormsItem {
    if (question.type === 'section') {
        return {
            title: question.question,
            description: question.description,
            sectionHeader: {
                title: question.question,
                description: question.description
            }
        };
    }

    const baseQuestion = mapQuestionTypeToGoogleForms(question.type);
    
    // Handle options for choice questions
    if (question.options && baseQuestion.choiceQuestion) {
        baseQuestion.choiceQuestion.options = question.options.map(opt => ({ value: opt }));
    }

    // Handle rating questions
    if (question.type === 'rating' && baseQuestion.scaleQuestion && question.settings?.ratingLabels) {
        baseQuestion.scaleQuestion.lowLabel = question.settings.ratingLabels.min;
        baseQuestion.scaleQuestion.highLabel = question.settings.ratingLabels.max;
        if (question.settings.minRating !== undefined) {
            baseQuestion.scaleQuestion.low = question.settings.minRating;
        }
        if (question.settings.maxRating !== undefined) {
            baseQuestion.scaleQuestion.high = question.settings.maxRating;
        }
    }

    return {
        title: question.question,
        description: question.description,
        questionItem: {
            question: {
                required: question.required,
                ...baseQuestion
            }
        }
    };
}

export async function optimizeForGoogleForms(survey: SurveyType | null): Promise<GoogleFormsForm> {
    if (!survey) {
        throw new Error('Survey data is required');
    }

    try {
        return convertToGoogleForms(survey);
    } catch (error) {
        console.error('Error converting survey to Google Forms format:', error);
        throw error;
    }
}

function convertToGoogleForms(survey: SurveyType): GoogleFormsForm {
    if (!survey || !survey.questions) {
        throw new Error('Invalid survey data: survey or questions is undefined');
    }

    return {
        info: {
            title: survey.title || 'Untitled Survey',
            documentTitle: survey.title || 'Untitled Survey',
            description: survey.description || '',
        },
        settings: {
            collectEmail: survey.settings?.collectEmail ?? false
        },
        items: Array.isArray(survey.questions) ? survey.questions.map(convertToGoogleFormsItem) : []
    };
}

async function optimizeForQualtrics(survey: SurveyType): Promise<SurveyType> {
    // TODO: Implement Qualtrics optimization
    console.log('Qualtrics optimization not implemented yet', survey);
    throw new Error("Qualtrics optimization not implemented yet");
}

async function optimizeForSurveyMonkey(survey: SurveyType): Promise<SurveyType> {
    // TODO: Implement SurveyMonkey optimization
    console.log('SurveyMonkey optimization not implemented yet', survey);
    throw new Error("SurveyMonkey optimization not implemented yet");
}