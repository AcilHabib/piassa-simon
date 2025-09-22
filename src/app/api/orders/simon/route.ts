import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';
import {getCurrentStuff} from '@/app/lib/current';

const prisma = new PrismaClient();

// POST endpoint to create an order
export async function POST(request: NextRequest) {
  try {
    // Retrieve the store id from the JWT using getCurrentStuff
    const currentStuff = await getCurrentStuff();
    console.log('[CURRENT STUFF]', currentStuff);
    const store_id = currentStuff?.store.id;
    if (!store_id) {
      console.error('[ERROR] Store not found');
      return NextResponse.json({success: false, error: 'Store not found'}, {status: 403});
    }

    const body = await request.json();
    console.log('[REQUEST BODY]', body);
    const {ref, items, total} = body;

    // Create a new Order with status = PAYED and type = SIMON
    const newOrder = await prisma.order.create({
      data: {
        ref,
        store_id,
        status: 'PAYED',
        type: 'SIMON',
        total,
        items: items.map((item: any) => ({
          ...item,
          store_id,
        })),
      },
    });

    console.log('[ORDER CREATED]', newOrder);
    return NextResponse.json({success: true, order: newOrder}, {status: 201});
  } catch (error) {
    console.error('[ERROR CREATING ORDER]', error.stack || error);
    return NextResponse.json({success: false, error: error.message}, {status: 500});
  }
}

// GET endpoint to fetch orders by item.store_id for both SIMON and REGULAR
export async function GET(request: NextRequest) {
  try {
    const store_id = request.nextUrl.searchParams.get('store_id');
    if (!store_id) {
      console.error('[ERROR] Store ID not provided');
      return NextResponse.json({success: false, error: 'Store ID not provided'}, {status: 400});
    }

    // Fetch all orders and include items where any item has matching store_id
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            store_id,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    const processedOrders = await Promise.all(
      orders.map(async (order) => {
        const processedItems = await Promise.all(
          order.items
            .filter((item) => item.store_id === store_id)
            .map(async (item) => {
              let org_designation = '';
              let price = 0;

              try {
                switch (item.type) {
                  case 'TIRE': {
                    const tire = await prisma.tire.findUnique({
                      where: {id: item.id},
                      select: {org_designation: true, sellingPrice: true},
                    });
                    org_designation = tire?.org_designation ?? 'Unknown TIRE';
                    price = tire?.sellingPrice ?? 0;
                    break;
                  }
                  case 'BATTERY':
                  case 'BODY':
                  case 'GLAZE':
                  case 'PART': {
                    const product = await prisma[item.type.toLowerCase()].findUnique({
                      where: {id: item.id},
                      select: {org_designation: true, sellingPrice: true},
                    });
                    org_designation = product?.org_designation ?? `Unknown ${item.type}`;
                    price = product?.sellingPrice ?? 0;
                    break;
                  }
                }
              } catch (error) {
                console.error(`Error fetching ${item.type} details:`, error);
              }

              return {
                ...item,
                org_designation,
                sellingPrice: price,
                orderId: order.id,
                orderRef: order.ref,
                createdAt: order.createdAt,
              };
            })
        );

        return processedItems;
      })
    );

    // Flatten and sort all items by createdAt
    const allItems = processedOrders
      .flat()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({success: true, orders: allItems}, {status: 200});
  } catch (error) {
    console.error('[ERROR FETCHING ORDERS]', error);
    return NextResponse.json({success: false, error: error.message}, {status: 500});
  }
}
