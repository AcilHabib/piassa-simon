import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

type GetArticlesRequest = NextRequest & {
  nextUrl: {
    searchParams: {
      get: (key: string) => string | null;
    };
  };
};

export const GET = async (req: GetArticlesRequest) => {
  const carModel = req.nextUrl.searchParams.get('carModel');

  if (!carModel) {
    return NextResponse.json({error: 'carModel is required'}, {status: 400});
  }

  try {
    // Fetch articles containing the carModel ID, ordered by newest first
    const tires = await prisma.tire.findMany({
      where: {
        carModel_ids: {
          has: carModel,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const glazes = await prisma.glaze.findMany({
      where: {
        carModel_ids: {
          has: carModel,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const bodies = await prisma.body.findMany({
      where: {
        carModel_ids: {
          has: carModel,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const parts = await prisma.part.findMany({
      where: {
        carModel_ids: {
          has: carModel,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Add 30% fee to all bodies' sellingPrice
    const updatedBodies = bodies.map((body) => ({
      ...body,
      sellingPrice: body.sellingPrice * 1.3,
    }));

    // Return the articles in the response
    return NextResponse.json(
      {
        carModel,
        tires,
        glazes,
        bodies: updatedBodies,
        parts,
      },
      {status: 200}
    );
  } catch (error) {
    console.error('Piassa: Get Articles Error:', error);
    return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
  }
};
