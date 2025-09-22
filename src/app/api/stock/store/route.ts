import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

type GetArticlesByStoreRequest = NextRequest & {
  nextUrl: {
    searchParams: {
      get: (key: string) => string | null;
    };
  };
};

export const GET = async (req: GetArticlesByStoreRequest) => {
  // Extract store ID from query parameters
  const storeId = req.nextUrl.searchParams.get('store_id');
  if (!storeId) {
    return NextResponse.json({error: 'store_id is required'}, {status: 400});
  }

  try {
    // Fetch articles containing the store ID in descending order by createdAt
    const tires = await prisma.tire.findMany({
      where: {store_id: storeId},
      include: {
        brand: {select: {name: true, id: true}},
        carModels: {select: {name: true, id: true}},
      },
      orderBy: {createdAt: 'desc'},
    });

    const glazes = await prisma.glaze.findMany({
      where: {store_id: storeId},
      include: {
        brand: {select: {name: true, id: true}},
        carModels: {select: {name: true, id: true}},
      },
      orderBy: {createdAt: 'desc'},
    });

    const bodies = await prisma.body.findMany({
      where: {store_id: storeId},
      include: {
        brand: {select: {name: true, id: true}},
        carModels: {select: {name: true, id: true}},
      },
      orderBy: {createdAt: 'desc'},
    });

    const parts = await prisma.part.findMany({
      where: {store_id: storeId},
      include: {
        brand: {select: {name: true, id: true}},
        carModels: {select: {name: true, id: true}},
      },
      orderBy: {createdAt: 'desc'},
    });

    // Return the articles in the response
    return NextResponse.json(
      {
        storeId,
        tires,
        glazes,
        bodies,
        parts,
      },
      {status: 200}
    );
  } catch (error) {
    console.error('[STOCK/STORE/ARTICLES] Get Articles by Store Error:', error);
    return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
  }
};

export async function PATCH(request: NextRequest) {
  const {searchParams} = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({success: false, error: 'ID is required'}, {status: 400});
  }

  const data = await request.json();

  try {
    // Check which collection the ID belongs to
    const body = await prisma.body.findUnique({where: {id}});
    if (body) {
      const updatedBody = await prisma.body.update({
        where: {id},
        data,
      });
      return NextResponse.json({success: true, data: updatedBody});
    }

    const glaze = await prisma.glaze.findUnique({where: {id}});
    if (glaze) {
      const updatedGlaze = await prisma.glaze.update({
        where: {id},
        data,
      });
      return NextResponse.json({success: true, data: updatedGlaze});
    }

    const tire = await prisma.tire.findUnique({where: {id}});
    if (tire) {
      const updatedTire = await prisma.tire.update({
        where: {id},
        data,
      });
      return NextResponse.json({success: true, data: updatedTire});
    }

    const part = await prisma.part.findUnique({where: {id}});
    if (part) {
      const updatedPart = await prisma.part.update({
        where: {id},
        data,
      });
      return NextResponse.json({success: true, data: updatedPart});
    }

    return NextResponse.json({success: false, error: 'Record not found'}, {status: 404});
  } catch (error: any) {
    console.error('[ERROR UPDATING ARTICLE]:', error);
    return NextResponse.json({success: false, error: error.message}, {status: 500});
  }
}
