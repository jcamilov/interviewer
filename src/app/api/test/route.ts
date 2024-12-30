import { parseFile } from '@/utils/parse-file';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: "Test endpoint is working",
    timestamp: new Date().toISOString()
  }, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: 'No file provided' 
      }, { status: 400 });
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'pdf' && fileExtension !== 'docx') {
      return NextResponse.json({ 
        success: false, 
        error: 'Only PDF and DOCX files are supported' 
      }, { status: 400 });
    }

    // parse the file
    const parsedFile = await parseFile(file, fileExtension as 'pdf' | 'docx');
    console.log(parsedFile);

    return NextResponse.json({ 
      success: true,
      filename: file.name,
      timestamp: new Date().toISOString()
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error processing request:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}
