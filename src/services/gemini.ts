import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface SurveyQuestion {
    id: string;
    question: string;
    type: "multiple_choice" | "text" | "rating";
    options?: string[];
}

export interface Survey {
    title: string;
    description: string;
    questions: SurveyQuestion[];
}

export async function generateSurvey(content: string): Promise<Survey> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `Create a comprehensive survey based on the following content. Follow these strict guidelines:

1. Return ONLY a valid JSON object, with no markdown formatting, no code blocks, and no additional text
2. Do not include \`\`\`json or any other formatting markers
3. Use these question types appropriately:
   - multiple_choice: Single selection from options
   - checkbox: Multiple selections allowed
   - text: Short text answer
   - paragraph: Long text answer
   - rating: Linear scale
   - dropdown: Single selection from dropdown
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
            "options": ["option1", "option2"],
            "settings": {
                "allowOther": boolean,
                "minRating": number,
                "maxRating": number,
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

Content to create survey for: ${content}`;

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
                throw new Error("Invalid survey structure");
            }

            // Validate each question
            parsedSurvey.questions.forEach((q: SurveyQuestion) => {
                if (!q.question || !q.type) {
                    throw new Error("Invalid question structure");
                }
                // Ensure options are present for choice-based questionsa
                if (['multiple_choice', 'checkbox', 'dropdown'].includes(q.type) && (!Array.isArray(q.options) || q.options.length === 0)) {
                    throw new Error(`Question "${q.question}" requires options`);
                }
            });

            return parsedSurvey;
        } catch (e) {
            const error = e as Error;
            console.error("Failed to parse AI response:", text, error);
            throw new Error(`Failed to parse AI response: ${error.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error("Error generating survey:", error);
        throw error;
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
