import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

type GetCarModelDetailsRequest = NextRequest & {
  nextUrl: {
    searchParams: {
      get: (key: string) => string | null;
    };
  };
};

export const GET = async (req: GetCarModelDetailsRequest) => {
  const brand_id = req.nextUrl.searchParams.get('brand_id');
  const model = req.nextUrl.searchParams.get('model');
  const variant = req.nextUrl.searchParams.get('variant');

  if (!brand_id || !model || !variant) {
    return NextResponse.json({error: 'Brand ID, model, and variant are required'}, {status: 400});
  }

  try {
    const carModel = await prisma.carModel.findFirst({
      where: {
        brand_id: brand_id,
        name: model,
        variants: {
          has: variant,
        },
      },
    });

    if (!carModel) {
      return NextResponse.json({error: 'Car model not found'}, {status: 404});
    }

    return NextResponse.json({carModel}, {status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({error: 'Internal server error'}, {status: 500});
  } finally {
    await prisma.$disconnect();
  }
};
