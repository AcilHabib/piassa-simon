import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

type GetOrdersRequest = NextRequest & {
  nextUrl: {
    searchParams: {
      get: (key: string) => string | null;
    };
  };
};

type PostOrderRequest = NextRequest & {
  json: () => Promise<{
    ref: string;
    total: number;
    client: {
      first_name?: string;
      last_name?: string;
      phone: string;
      address?: string;
      geoData?: object;
    };
    tire_ids?: string[];
    parts_ids?: string[];
    bodies_ids?: string[];
    glazes_ids?: string[];
    battery_ids?: string[];
    simonSessions_ids?: string[];
  }>;
};

export const GET = async (req: GetOrdersRequest) => {
  const phone = req.nextUrl.searchParams.get('phone');

  if (!phone) {
    return NextResponse.json({error: 'Phone number is required'}, {status: 400});
  }

  try {
    // Fetch orders containing this phone in the embedded client
    const orders = await prisma.order.findMany({
      where: {
        client: {
          is: {phone},
        },
      },
    });
    return NextResponse.json({data: orders}, {status: 200});
  } catch (error) {
    console.error('Fetch Orders error:', error);
    return NextResponse.json({error: 'Error fetching orders'}, {status: 500});
  }
};
