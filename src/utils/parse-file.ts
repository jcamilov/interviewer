import edenAi from '@api/eden-ai';
import { env } from 'process';

export const parseFile = async (file: File | Blob) => {
  // Check file type
  if (!file.type.match(/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document)/)) {
    throw new Error('File must be PDF or DOCX format');
  }

  try {
    const formData = new FormData();
    formData.append('providers', 'openai/gpt-4o-mini');
    formData.append('file', file);

    const response = await fetch('https://api.edenai.run/v2/ocr/resume_parser', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.EDENAI_BEARER_TOKEN}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Eden AI API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    if (!data) {
      throw new Error("No data returned from Eden AI");
    }

    return data;
  } catch (error) {
    console.error("Error in parseFile:", error);
    throw error instanceof Error ? error : new Error('Failed to parse file');
  }
}