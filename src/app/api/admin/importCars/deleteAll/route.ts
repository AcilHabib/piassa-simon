import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

async function clearReferences() {
  // Clear all references first
  await prisma.body.updateMany({
    data: {
      carModel_ids: [],
      order_ids: [],
    },
  });

  await prisma.tire.updateMany({
    data: {
      carModel_ids: [],
      brand_id: '',
    },
  });

  await prisma.body.updateMany({
    data: {
      carModel_ids: [],
      brand_id: '',
    },
  });

  await prisma.glaze.updateMany({
    data: {
      carModel_ids: [],
      brand_id: '',
    },
  });

  await prisma.part.updateMany({
    data: {
      carModel_ids: [],
    },
  });

  await prisma.carModel.updateMany({
    data: {
      brand_id: '',
      body_ids: [],
      part_ids: [],
      tire_ids: [],
      glaze_ids: [],
    },
  });

  // await prisma.brand.updateMany({
  //   data: {
  //     carModels: [],
  //   },
  // });
  // Remove incorrect brand_id field
}

async function deleteBrandEntities() {
  // Delete in correct order respecting relationships

  // await prisma.carModel.deleteMany({});
  await prisma.brand.deleteMany({});
}
async function deleteCarModelsEntities() {
  // Delete in correct order respecting relationships

  // await prisma.carModel.deleteMany({});
  await prisma.carModel.deleteMany({});
}

export async function DELETE(request: NextRequest) {
  try {
    // Clear all references first
    await prisma.$transaction(clearReferences, {timeout: 10000});

    // Then delete all entities
    // await prisma.$transaction(deleteCarModelsEntities, {timeout: 10000}).then(()=>{})
    await prisma.$transaction(deleteBrandEntities, {timeout: 10000});

    return NextResponse.json({
      success: true,
      message: 'All data deleted successfully',
    });
  } catch (error) {
    console.error('[DELETE ALL ERROR]', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      {status: 500}
    );
  } finally {
    await prisma.$disconnect();
  }
}
