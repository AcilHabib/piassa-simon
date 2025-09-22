import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

type PostGlazeRequest = NextRequest & {
  json: () => Promise<{
    image?: string;
    quantity: number;
    sellingPrice: number;
    store_id: string;
    effect: string;
    position: string;
    designation: string;
    brand_id: string;
    order_ids: string[];
    carModel_ids: string[];
  }>;
};

export const POST = async (req: PostGlazeRequest) => {
  const {image, quantity, sellingPrice, store_id, effect, position, designation, brand_id, order_ids, carModel_ids} =
    await req.json();

  try {
    const newGlaze = await prisma.glaze.create({
      data: {
        image,
        quantity,
        sellingPrice,
        store_id,
        effect,
        position,
        designation,
        brand_id,
        order_ids,
        carModel_ids,
      },
    });
    return NextResponse.json({data: newGlaze}, {status: 201});
  } catch (error) {
    console.error('Create Glaze error:', error);
    return NextResponse.json({error: 'Error creating glaze'}, {status: 500});
  }
};
