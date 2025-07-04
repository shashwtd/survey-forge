import mammoth from 'mammoth';
import pdfToText from "react-pdftotext";

export async function extractFileContent(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();

    if (file.type === 'application/pdf') {
        try {
            const text = await pdfToText(file);
            return text;
        } catch (error) {
            console.error('Error extracting PDF text:', error);
            throw new Error('Failed to extract text from PDF');
        }
    }
    
    if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ arrayBuffer: buffer });
        return result.value;
    }

    if (file.type === 'text/plain' || file.type === 'text/markdown') {
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(buffer);
    }

    throw new Error('Unsupported file type');
}
