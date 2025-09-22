import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const GET = async (req: NextRequest) => {
  const store_id = req.nextUrl.searchParams.get('store_id');

  if (!store_id) {
    return NextResponse.json({error: 'Store ID is required'}, {status: 400});
  }

  try {
    const bodies = await prisma.body.findMany({
      where: {
        store_id: store_id,
      },
      include: {
        store: true,
        brand: true,
        carModels: true,
        orders: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: bodies,
      },
      {status: 200}
    );
  } catch (error) {
    console.error('[ERROR] Failed to fetch bodies:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch bodies',
      },
      {status: 500}
    );
  }
};
