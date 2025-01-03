import { NextResponse } from 'next/server';
import { parseFile } from '@/utils/parse-file';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: 'No valid file provided' },
        { status: 400 }
      );
    }

    // Get the file name and type
    const fileName = 'file' in file ? file.name : 'uploaded-file';
    const fileType = file.type;

    // Parse the file
    try {
      const parsedData = await parseFile(file);
      return NextResponse.json({ parsedData, fileName });
    } catch (error) {
      console.error('Error parsing file:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return NextResponse.json(
        { error: 'Failed to parse CV file', details: errorMessage },
        { status: 422 }
      );
    }
  } catch (error) {
    console.error('Error handling request:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}