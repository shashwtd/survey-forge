import mammoth from 'mammoth';
import pdfToText from "react-pdftotext";
import '@/utils/promisePolyfill';

export async function extractFileContent(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();

    if (file.type === 'application/pdf') {
        try {
            // Wrap PDF extraction in error boundary
            const text = await Promise.race([
                pdfToText(file),
                new Promise<string>((_, reject) => 
                    setTimeout(() => reject(new Error('PDF extraction timeout')), 30000)
                )
            ]);
            return text || 'No text content extracted from PDF';
        } catch (error) {
            console.error('Error extracting PDF text:', error);
            throw new Error('Failed to extract text from PDF. Please ensure the PDF contains extractable text.');
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
