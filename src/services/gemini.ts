import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export type QuestionType = 
    | "multiple_choice"
    | "checkbox"
    | "text"
    | "paragraph"
    | "rating"
    | "dropdown"
    | "date"
    | "time"
    | "email"
    | "number";

interface SurveyQuestion {
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
            min: string;
            max: string;
        };
        validation?: {
            min?: number;
            max?: number;
            pattern?: string;
        };
    };
}

export interface Survey {
    title: string;
    description: string;
    settings: {
        collectEmail: boolean;
        confirmationMessage: string;
        allowMultipleResponses: boolean;
    };
    questions: SurveyQuestion[];
}

export class GeminiServiceError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly status?: number
    ) {
        super(message);
        this.name = 'GeminiServiceError';
    }
}

export async function generateSurvey(content: string): Promise<Survey> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `Create a comprehensive survey based on the following content. Follow these strict guidelines:

1. Return ONLY a valid JSON object, with no markdown formatting, no code blocks, and no additional text
2. Do not include \`\`\`json or any other formatting markers
3. For dropdown questions, always include the same options as related multiple_choice/checkbox questions
4. Never return empty options array for multiple_choice, checkbox, or dropdown questions
5. Use these question types appropriately:
   - multiple_choice: Single selection from options
   - checkbox: Multiple selections allowed
   - text: Short text answer
   - paragraph: Long text answer
   - rating: Linear scale (1-5 by default)
   - dropdown: Single selection from dropdown (must have options)
   - date: Date input
   - time: Time input
   - email: Email validation
   - number: Numeric input

Use this exact JSON structure, with no formatting or additional text:
{
    "title": "Clear, relevant title",
    "description": "Brief survey description",
    "settings": {
        "collectEmail": boolean,
        "confirmationMessage": "Message shown after submission",
        "allowMultipleResponses": boolean
    },
    "questions": [
        {
            "question": "Clear question text",
            "type": "one of the question types above",
            "required": boolean,
            "description": "Optional helper text",
            "options": ["option1", "option2"], // Required for multiple_choice, checkbox, dropdown
            "settings": {
                "allowOther": boolean, // for multiple_choice, checkbox
                "minRating": number, // for rating
                "maxRating": number, // for rating
                "ratingLabels": {
                    "min": "Worst",
                    "max": "Best"
                },
                "validation": {
                    "min": number,
                    "max": number,
                    "pattern": "regex pattern"
                }
            }
        }
    ]
}

Important rules:
1. For dropdown questions, use options from a related multiple_choice/checkbox question if they are related
2. Never return empty options arrays
3. Each multiple_choice, checkbox, and dropdown question must have at least 2 options

Content to create survey for: ${content}`;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();

            // Clean up any potential markdown or code block formatting
            text = text.replace(/```json\s*/, '').replace(/```\s*$/, '');

            try {
                const parsedSurvey = JSON.parse(text.trim());
                
                // Add unique IDs to each question
                parsedSurvey.questions = parsedSurvey.questions.map((q: SurveyQuestion, index: number) => ({
                    ...q,
                    id: `q${Date.now()}_${index}`
                }));

                // Validate required fields
                if (!parsedSurvey.title || !parsedSurvey.description || !Array.isArray(parsedSurvey.questions)) {
                    throw new GeminiServiceError(
                        "Invalid survey structure",
                        "INVALID_RESPONSE",
                        400
                    );
                }

                // Validate each question
                parsedSurvey.questions.forEach((q: SurveyQuestion, index: number) => {
                    if (!q.question || !q.type) {
                        throw new GeminiServiceError(
                            `Invalid question structure at index ${index}`,
                            "INVALID_QUESTION",
                            400
                        );
                    }

                    // Ensure options are present for choice-based questions
                    if (['multiple_choice', 'checkbox', 'dropdown'].includes(q.type)) {
                        if (!Array.isArray(q.options) || q.options.length < 2) {
                            throw new GeminiServiceError(
                                `Question "${q.question}" requires at least 2 options`,
                                "INVALID_OPTIONS",
                                400
                            );
                        }
                    }

                    // For dropdown questions, try to use options from related checkbox questions
                    if (q.type === 'dropdown' && (!q.options || q.options.length === 0)) {
                        const relatedQuestion = parsedSurvey.questions
                            .slice(0, index)
                            .find((prev: SurveyQuestion) => 
                                (prev.type === 'checkbox' || prev.type === 'multiple_choice') && 
                                prev.options && 
                                prev.options.length > 0
                            );
                        
                        if (relatedQuestion && relatedQuestion.options) {
                            q.options = [...relatedQuestion.options];
                        } else {
                            throw new GeminiServiceError(
                                `Dropdown question "${q.question}" requires options`,
                                "INVALID_OPTIONS",
                                400
                            );
                        }
                    }
                });

                return parsedSurvey;
            } catch (e) {
                if (e instanceof GeminiServiceError) {
                    throw e;
                }
                const error = e as Error;
                console.error("Failed to parse AI response:", text, error);
                throw new GeminiServiceError(
                    `Failed to parse AI response: ${error.message || 'Unknown error'}`,
                    "PARSE_ERROR",
                    400
                );
            }
        } catch (error: unknown) {
            if (error instanceof GeminiServiceError) {
                throw error;
            }
            // Handle Gemini API specific errors
            if (typeof error === 'object' && error && 'status' in error) {
                if ((error as { status: number }).status === 503) {
                    console.error('[Gemini API] Service overloaded');
                    throw new GeminiServiceError(
                        "The AI service is currently overloaded. Please try again in a few minutes.",
                        "SERVICE_OVERLOADED",
                        503
                    );
                }
            }
            console.error('[Gemini API] Generation error:', error instanceof Error ? error.message : 'Unknown error');
            throw new GeminiServiceError(
                error instanceof Error ? error.message : "Failed to generate survey",
                "GENERATION_ERROR",
                500
            );
        }
    } catch (error) {
        if (error instanceof GeminiServiceError) {
            throw error;
        }
        console.error('[Gemini API] Unexpected error:', error);
        throw new GeminiServiceError(
            "An unexpected error occurred while generating the survey",
            "UNKNOWN_ERROR",
            500
        );
    }
}

export async function processFileContent(file: File): Promise<string> {
    // For now, we'll just read text files
    // TODO: Add support for PDF and DOC files
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            resolve(e.target?.result as string);
        };
        reader.onerror = (e) => {
            reject(e);
        };
        reader.readAsText(file);
    });
}
