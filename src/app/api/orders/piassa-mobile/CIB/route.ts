import {NextRequest, NextResponse} from 'next/server';
import {Client, OrderItem, PrismaClient, Store} from '@prisma/client';

const prisma = new PrismaClient();

type PostOrderRequest = NextRequest & {
  json: () => Promise<{
    ref: string;
    total: number;
    client: Client;
    store_id: string;
    battery_ids: string[];
    simonSessions_ids: string[];
  }>;
};

export const POST = async (req: PostOrderRequest) => {
  const {ref, total, client, store_id, items, geoData} = await req.json();
  console.log('[POST | ORDERS | PIASSA-CIB]', {ref, total, client, items, geoData});
  try {
    const newOrder = await prisma.order.create({
      data: {
        ref,
        total,
        store_id,
        client: {
          first_name: client.first_name,
          last_name: client.last_name,
          phone: client.phone,
          state: client.state,
          city: client.city,
          address: client.address,
          geoData: JSON.stringify({
            lat: geoData?.lat,
            lng: geoData?.lng,
          }),
        },
        items: items.map((item: OrderItem) => {
          return {
            id: item.id,
            quantity: item.quantity,
            sellingPrice: item.sellingPrice,
            type: item.type,
            store_id: item.store_id,
          };
        }),
        status: 'PAYED',
      },
    });
    return NextResponse.json({data: newOrder}, {status: 201});
  } catch (error) {
    console.error('Create Order error:', error);
    return NextResponse.json({error: '[ERROR | ORDERS | PIASSA-CIB', error}, {status: 500});
  }
};
