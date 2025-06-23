/*

This service is used to optimize the survey data according to the selected
survey platform for more compatibility and ease of use.

*/

import { SurveyType, SurveyQuestion } from "@/types/survey";
import { GoogleFormsForm, GoogleFormsItem } from "@/types/GoogleFormSurvey";

// The main function
export async function optimizeSurvey(
    survey: SurveyType,
    platform: "google_forms" | "qualtrics" | "surveymonkey"
): Promise<GoogleFormsForm | SurveyType> {
    if (platform === "google_forms") {
        return optimizeForGoogleForms(survey);
    } else if (platform === "qualtrics") {
        return optimizeForQualtrics(survey);
    } else if (platform === "surveymonkey") {
        return optimizeForSurveyMonkey(survey);
    } else {
        throw new Error("Unsupported platform");
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
        default:
            return { textQuestion: { paragraph: false } };
    }
}

function convertToGoogleFormsItem(question: SurveyQuestion): GoogleFormsItem {
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

async function optimizeForGoogleForms(survey: SurveyType): Promise<GoogleFormsForm> {
    return {
        info: {
            title: survey.title,
            documentTitle: survey.title,
            description: survey.description
        },
        settings: {
            collectEmail: survey.settings?.collectEmail ?? false
        },
        items: survey.questions.map(convertToGoogleFormsItem)
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