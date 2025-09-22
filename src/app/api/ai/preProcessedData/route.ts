import {NextRequest, NextResponse} from 'next/server';
import * as XLSX from 'xlsx';

const API_KEY = process.env.AI_API_KEY;

async function validateApiKey(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const apiKey = authHeader?.replace('Bearer ', '');
  return apiKey && apiKey === API_KEY;
}

export async function POST(request: NextRequest) {
  try {
    const isValidApiKey = await validateApiKey(request);
    if (!isValidApiKey) {
      return NextResponse.json({success: false, error: 'Unauthorized - Invalid API Key'}, {status: 401});
    }

    const formData = await request.formData();
    const file = formData.get('file');
    if (!file) {
      return NextResponse.json({success: false, error: 'File not provided'}, {status: 400});
    }

    const arrayBuffer = await (file as File).arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const workbook = XLSX.read(buffer, {type: 'buffer'});
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    return NextResponse.json({success: true, data}, {status: 200});
  } catch (error: any) {
    console.error('[PREPROCESSED DATA ERROR]', error);
    return NextResponse.json({success: false, error: error.message}, {status: 500});
  }
}
