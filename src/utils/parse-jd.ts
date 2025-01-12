// this file is used to parse a Job Description using the Eden AI API. 
// Here is where we change the parser if needed

import OpenAI from "openai";

export const parseJD = async (file: File | Blob) => {
  // Check file type
  if (!file.type.match(/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document)/)) {
    throw new Error('File must be PDF or DOCX format');
  }

  const provider = 'amazon';  // Using Amazon as the provider based on Eden AI docs

  console.log("Parsing Job Description:", file);
  try {
    const formData = new FormData();
    formData.append('providers', provider);
    formData.append('file', file);
    formData.append('language', 'en');  // Specify English language

    // Launch the async OCR job
    const launchResponse = await fetch('https://api.edenai.run/v2/ocr/ocr_async', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.EDENAI_BEARER_TOKEN}`,
      },
      body: formData,
    });

    if (!launchResponse.ok) {
      const errorData = await launchResponse.json();
      throw new Error(`Eden AI API error: ${JSON.stringify(errorData)}`);
    }

    const launchData = await launchResponse.json();
    if (!launchData.public_id) {
      throw new Error('No job ID returned from Eden AI');
    }
    const jobId = launchData.public_id;

    // Poll for results
    let resultData;
    let attempts = 0;
    const maxAttempts = 30; // Maximum number of polling attempts
    const pollingInterval = 2000; // 2 seconds between attempts

    while (attempts < maxAttempts) {
      const resultResponse = await fetch(`https://api.edenai.run/v2/ocr/ocr_async/${jobId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.EDENAI_BEARER_TOKEN}`,
        },
      });

      if (!resultResponse.ok) {
        const errorData = await resultResponse.json();
        throw new Error(`Eden AI API error: ${JSON.stringify(errorData)}`);
      }

      resultData = await resultResponse.json();
      console.log("Current result data:", resultData); // Debug log
      
      if (resultData.status === 'finished') {
        if (!resultData.results?.[provider]?.raw_text) {
          throw new Error('No text content found in the response');
        }
        console.log("Eden AI Response:", resultData.results[provider]);
        return resultData.results[provider].raw_text;  // Return the extracted text
      } else if (resultData.status === 'failed') {
        throw new Error('Job processing failed');
      }

      // Wait before next polling attempt
      await new Promise(resolve => setTimeout(resolve, pollingInterval));
      attempts++;
    }

    throw new Error('Job processing timeout');
  } catch (error) {
    console.error("Error in parseJD:", error);
    throw error instanceof Error ? error : new Error('Failed to parse job description');
  }
} 