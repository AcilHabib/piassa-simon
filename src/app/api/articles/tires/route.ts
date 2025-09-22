import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

type PostTireRequest = NextRequest & {
  json: () => Promise<{
    image?: string;
    quantity: number;
    sellingPrice: number;
    store_id: string;
    width: number;
    aspectRatio: number;
    rimDiameter: number;
    brand_id: string;
    order_ids: string[];
    carModel_ids: string[];
  }>;
};

export const POST = async (req: PostTireRequest) => {
  const {image, quantity, sellingPrice, store_id, width, aspectRatio, rimDiameter, brand_id, order_ids, carModel_ids} =
    await req.json();

  try {
    const newTire = await prisma.tire.create({
      data: {
        image,
        quantity,
        sellingPrice,
        store_id,
        width,
        aspectRatio,
        rimDiameter,
        brand_id,
        order_ids,
        carModel_ids,
      },
    });
    return NextResponse.json({data: newTire}, {status: 201});
  } catch (error) {
    console.error('Create Tire error:', error);
    return NextResponse.json({error: 'Error creating tire'}, {status: 500});
  }
};
