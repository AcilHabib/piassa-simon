import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();
const API_KEY = process.env.AI_API_KEY;

async function validateApiKey(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const apiKey = authHeader?.replace('Bearer ', '');

  if (!apiKey || apiKey !== API_KEY) {
    return false;
  }
  return true;
}

export async function GET(request: NextRequest) {
  try {
    const isValidApiKey = await validateApiKey(request);
    if (!isValidApiKey) {
      return NextResponse.json({error: 'Unauthorized - Invalid API Key'}, {status: 401});
    }

    const carModels = await prisma.carModel.findMany({
      include: {
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({carModels}, {status: 200});
  } catch (error) {
    console.error('CarModels Fetch Error:', error);
    return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
  }
}
