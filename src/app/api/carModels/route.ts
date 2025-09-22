import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

type GetCarModelsRequest = NextRequest & {
  nextUrl: {
    searchParams: {
      get: (key: string) => string | null;
    };
  };
};

type PostCarModelRequest = NextRequest & {
  json: () => Promise<{
    name: string;
    brand_id: string;
    image: string;
    variants?: string[];
    tire_ids?: string[];
    part_ids?: string[];
    body_ids?: string[];
    glaze_ids?: string[];
    battery_ids?: string[];
  }>;
};

export const GET = async (req: GetCarModelsRequest) => {
  const brand_id = req.nextUrl.searchParams.get('brand_id');

  if (!brand_id) {
    return NextResponse.json({error: 'Brand ID is required'}, {status: 400});
  }

  try {
    const carModels = await prisma.carModel.findMany({
      where: {
        brand_id: brand_id,
      },
      orderBy: {
        name: 'asc',
      },
      include: {
        brand: {
          select: {
            name: true,
          },
        },
      },
    });
    return NextResponse.json({carModels}, {status: 200});
  } catch (error) {
    return NextResponse.json({error: 'Internal server error'}, {status: 500});
  }
};

export const POST = async (req: PostCarModelRequest) => {
  const {name, brand_id, image, variants, tire_ids, part_ids, body_ids, glaze_ids, battery_ids} = await req.json();

  if (!name || !brand_id || !image) {
    return NextResponse.json({error: 'Name, Brand ID, and Image are required'}, {status: 400});
  }

  const data: any = {
    name,
    image,
  };

  if (variants) data.variants = variants;
  // if (tire_ids) data.tire_ids = tire_ids;
  // if (part_ids) data.part_ids = part_ids;
  // if (body_ids) data.body_ids = body_ids;
  // if (glaze_ids) data.glaze_ids = glaze_ids;
  // if (battery_ids) data.battery_ids = battery_ids;

  try {
    const carModel = await prisma.carModel.create({data});
    return NextResponse.json({carModel}, {status: 201});
  } catch (error) {
    console.error(error);
    return NextResponse.json({error: 'Internal server error'}, {status: 500});
  }
};
