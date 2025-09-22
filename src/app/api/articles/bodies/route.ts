import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

type PostBodyRequest = NextRequest & {
  json: () => Promise<{
    image?: string;
    quantity: number;
    sellingPrice: number;
    store_id: string;
    model: string;
    year: number;
    position?: string;
    color?: {
      name: string;
      hex: string;
    };
    brand_id: string;
    order_ids: string[];
    carModel_ids: string[];
    designation: string;
  }>;
};

export const POST = async (req: PostBodyRequest) => {
  const {
    image,
    quantity,
    sellingPrice,
    store_id,
    model,
    year,
    position,
    color,
    brand_id,
    order_ids,
    carModel_ids,
    designation,
  } = await req.json();

  try {
    const newBody = await prisma.body.create({
      data: {
        image,
        quantity,
        sellingPrice,
        store_id,
        model,
        year,
        position,
        color,
        brand_id,
        order_ids,
        carModel_ids,
        designation,
      },
    });
    return NextResponse.json({data: newBody}, {status: 201});
  } catch (error) {
    console.error('Create Body error:', error);
    return NextResponse.json({error: 'Error creating body'}, {status: 500});
  }
};
