import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface SurveyQuestion {
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

export async function generateSurvey(content: string): Promise<Survey> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `Create a survey based on the following content. Return the response as a JSON object with the following structure:
        {
            "title": "Survey title based on content",
            "description": "Brief description of the survey",
            "questions": [
                {
                    "id": "unique_id",
                    "question": "Question text",
                    "type": "multiple_choice" | "text" | "rating",
                    "options": ["option1", "option2"] // only for multiple_choice
                }
            ]
        }

        Content: ${content}`;

        const result = await model.generateContent(prompt);        const response = await result.response;
        const text = response.text();
        
        try {
            // Remove markdown code fence if present
            const jsonText = text.replace(/^```json\n|\n```$/g, '').trim();
            return JSON.parse(jsonText);
        } catch (e) {
            console.error('Failed to parse AI response:', text, e);
            throw new Error('Failed to parse AI response');
        }
    } catch (error) {
        console.error('Error generating survey:', error);
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
