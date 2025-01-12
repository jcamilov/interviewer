import { parseCV } from '@/utils/parse-cv';
import { parseJD } from '@/utils/parse-jd';
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
    const type = formData.get('type') as string | null;

    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: 'No file provided' 
      }, { status: 400 });
    }

    if (!type || (type !== 'cv' && type !== 'jd')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Type must be either "cv" or "jd"' 
      }, { status: 400 });
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'pdf' && fileExtension !== 'docx') {
      return NextResponse.json({ 
        success: false, 
        error: 'Only PDF and DOCX files are supported' 
      }, { status: 400 });
    }

    // Parse the file based on type
    const parsedData = await (type === 'cv' ? parseCV(file) : parseJD(file));
    console.log(parsedData);

    return NextResponse.json({ 
      success: true,
      filename: file.name,
      type,
      parsedData,
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
