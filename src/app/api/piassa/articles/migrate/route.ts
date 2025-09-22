import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Parse oldStoreId and newStoreId from the request body
    const {oldStoreId, newStoreId} = await request.json();

    if (!oldStoreId || !newStoreId) {
      return NextResponse.json({success: false, error: 'oldStoreId and newStoreId are required'}, {status: 400});
    }

    // Update store_id for tires, parts, glazes, and bodies
    const [tireUpdate, partUpdate, glazeUpdate, bodyUpdate] = await Promise.all([
      prisma.tire.updateMany({
        data: {store_id: newStoreId},
      }),
      prisma.part.updateMany({
        data: {store_id: newStoreId},
      }),
      prisma.glaze.updateMany({
        data: {store_id: newStoreId},
      }),
      prisma.body.updateMany({
        data: {store_id: newStoreId},
      }),
    ]);

    return NextResponse.json({
      success: true,
      updated: {
        tireUpdate,
        partUpdate,
        glazeUpdate,
        bodyUpdate,
      },
    });
  } catch (error) {
    console.error('Migration Error:', error);
    return NextResponse.json({success: false, error}, {status: 500});
  }
}
