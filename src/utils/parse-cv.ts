// this file is used to parse a CV using the Eden AI API. 
// Here is where we change the parser if needed

import OpenAI from "openai";

export const parseCV = async (file: File | Blob) => {
  // Check file type
  if (!file.type.match(/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document)/)) {
    throw new Error('File must be PDF or DOCX format');
  }

  const provider = 'openai/gpt-4o-mini';

  console.log("Parsing CV:", file);
  try {
    const formData = new FormData();
    formData.append('providers', provider);
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
    if (data[provider].status !== "success") {
      throw new Error("No data returned from Eden AI");
    }
    console.log("Eden AI Response:", data[provider]);

    return data[provider].extracted_data;
  } catch (error) {
    console.error("Error in parseCV:", error);
    throw error instanceof Error ? error : new Error('Failed to parse CV');
  }
} 