import {NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const GET = async () => {
  try {
    // Fetch articles containing the carModel ID, ordered by newest first
    const tires = await prisma.tire.findMany({
      include: {
        brand: true,
        carModels: true,
        store: true,
      }
    }); 

    const glazes = await prisma.glaze.findMany({
      include: {
        brand: true,
        carModels: true,
        store: true,
      }
    });

    const bodies = await prisma.body.findMany({
      include: {
        brand: true,
        carModels: true,
        store: true,
      },
    });

    const parts = await prisma.part.findMany({
      include: {
        brand: true,
        carModels: true,
        store: true,
      },
    });

    // Add 30% fee to all bodies' sellingPrice
    const updatedBodies = bodies.map((body) => ({
      ...body,
      sellingPrice: body.sellingPrice * 1.3,
    }));

    // Sort the articles by createdAt date in descending order
    tires?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    glazes?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    updatedBodies?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    parts?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Return the articles in the response
    return NextResponse.json(
      {
        tires,
        glazes,
        bodies: updatedBodies,
        parts,
      },
      {status: 200}
    );
  } catch (error) {
    console.error('Piassa: Get Articles Error:', error);
    return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
  }
};
