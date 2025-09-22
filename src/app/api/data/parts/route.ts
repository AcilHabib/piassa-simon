import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

type PostPartRequest = NextRequest & {
  json: () => Promise<{
    image?: string;
    quantity: number;
    sellingPrice: number;
    store_id: string;
    designationAM: string;
    designationTD: string;
    refAM: string;
    refTD: string;
    brand_id: string;
    order_ids: string[];
    carModel_ids: string[];
  }>;
};

export const POST = async (req: PostPartRequest) => {
  const {
    image,
    quantity,
    sellingPrice,
    store_id,
    designationAM,
    designationTD,
    refAM,
    refTD,
    brand_id,
    order_ids,
    carModel_ids,
  } = await req.json();

  try {
    const newPart = await prisma.part.create({
      data: {
        image,
        quantity,
        sellingPrice,
        store_id,
        designationAM,
        designationTD,
        refAM,
        refTD,
        brand_id,
        order_ids,
        carModel_ids,
      },
    });
    return NextResponse.json({newPart}, {status: 201});
  } catch (error) {
    return NextResponse.json({error: 'Error creating part'}, {status: 500});
  }
};
