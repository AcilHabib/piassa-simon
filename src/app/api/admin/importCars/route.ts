import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';
import carsModels from '@/lib/Car';

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  const exceptions = [];

  for (const brandData of carsModels) {
    try {
      // Find or create the brand
      let brand = await prisma.brand.findFirst({
        where: {name: brandData.label},
      });

      if (!brand) {
        brand = await prisma.brand.create({
          data: {
            name: brandData.label,
            logo: '', // Add logo URL if available
            isCarProd: true,
            isTireProd: false,
            isPartProd: false,
            isBodyProd: false,
            isGlazeProd: false,
            isBatteryProd: false,
          },
        });
      }

      for (const carModel of brandData.models) {
        try {
          // Map motors to variants
          const variants = carModel.motors.map((motor) => motor.label);

          // Create the car model
          await prisma.carModel.create({
            data: {
              name: carModel.label,
              brand_id: brand.id,
              variants: variants, // Use mapped variants
              // image: carModel.image || '', // Add image URL if available
            },
          });
        } catch (error) {
          console.error('[CAR MODEL CREATION ERROR]', {
            carModel: carModel.label,
            brand_id: brand.id,
            error: error.message,
          });
          exceptions.push({
            carModel,
            error: error.message,
          });
        }
      }
    } catch (error: any) {
      exceptions.push({
        brand: brandData.label,
        error: error.message,
      });
    }
  }

  return NextResponse.json({exceptions}, {status: 200});
};
