import pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';

/**
 * Parses a PDF or DOCX file and extracts the text content
 * @param file File object to parse
 * @param fileType Type of the file ('pdf' or 'docx')
 * @returns Promise<boolean> true if parsing was successful, false otherwise
 */
export async function parseFile(file: File, fileType: 'pdf' | 'docx'): Promise<boolean> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        let text = '';

        if (fileType === 'pdf') {
            const pdfData = await pdfParse(buffer);
            text = pdfData.text;
        } else if (fileType === 'docx') {
            const result = await mammoth.extractRawText({ buffer });
            text = result.value;
        } else {
            console.error('Unsupported file format. Only PDF and DOCX files are supported.');
            return false;
        }

        console.log('Extracted text:', text);
        return true;
    } catch (error) {
        console.error('Error parsing file:', error);
        return false;
    }
}
