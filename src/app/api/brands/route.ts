import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

type GetBrandsRequest = NextRequest;
type PostBrandRequest = NextRequest & {
  json: () => Promise<{
    name: string;
    logo?: string;
    isCarProd?: boolean;
    isTireProd?: boolean;
    isPartProd?: boolean;
    isBodyProd?: boolean;
    isGlazeProd?: boolean;
    isBatteryProd?: boolean;
  }>;
};

export const GET = async (req: GetBrandsRequest) => {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json({brands}, {status: 200});
  } catch (error) {
    console.log('Get All Brands Error:', error);
    return NextResponse.json({error: 'Internal server error'}, {status: 500});
  }
};

export const POST = async (req: PostBrandRequest) => {
  const {name, logo, isCarProd, isTireProd, isPartProd, isBodyProd, isGlazeProd, isBatteryProd} = await req.json();

  if (!name) {
    return NextResponse.json({error: 'Brand name is required'}, {status: 400});
  }

  try {
    const brand = await prisma.brand.create({
      data: {
        name,
        logo,
        isCarProd,
        isTireProd,
        isPartProd,
        isBodyProd,
        isGlazeProd,
        isBatteryProd,
      },
    });
    return NextResponse.json({brand}, {status: 201});
  } catch (error) {
    console.log('Create Brand Error:', error);
    return NextResponse.json({error: 'Internal server error'}, {status: 500});
  }
};
