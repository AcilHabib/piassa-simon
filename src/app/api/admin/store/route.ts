import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

interface CreateStoreRequest {
  name: string;
  logo?: string;
  geoData: any;
  address: string;
  stuffLimit: number;
  ref: string;
  dueDate: Date;
  admin_id: string;
  // Stuff fields
  username: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: CreateStoreRequest = await req.json();

    // Validate required fields
    if (!body.name || !body.address || !body.username || !body.password || !body.admin_id) {
      return NextResponse.json({error: 'Missing required fields'}, {status: 400});
    }

    // Create store and owner in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create store
      const store = await tx.store.create({
        data: {
          name: body.name,
          logo: body.logo,
          geoData: body.geoData || {},
          address: body.address,
          stuffLimit: body.stuffLimit || 5,
          ref: body.ref,
          dueDate: body.dueDate,
          admin_id: body.admin_id,
        },
      });

      // Create owner stuff linked to store
      const stuff = await tx.stuff.create({
        data: {
          username: body.username,
          password: body.password,
          store_id: store.id,
          role: 'Owner',
        },
      });

      return {store, stuff};
    });

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      {status: 201}
    );
  } catch (error) {
    console.error('[ERROR] Store creation failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create store and owner',
      },
      {status: 500}
    );
  }
}
