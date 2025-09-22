import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Separate OPTIONS handler
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: corsHeaders,
    status: 204,
  });
}

// Main DELETE handler
export async function DELETE(request: NextRequest) {
  try {
    const deleteResult = await prisma.body.deleteMany({});

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: 'All bodies deleted successfully',
        count: deleteResult.count,
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error('[ERROR] DELETE operation failed:', error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: 'Failed to delete bodies',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}
// import {NextRequest, NextResponse} from 'next/server';
// import {PrismaClient} from '@prisma/client';

// const prisma = new PrismaClient();

// const corsHeaders = {
//   'Access-Control-Allow-Origin': '*',
//   'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
//   'Access-Control-Allow-Headers': 'Content-Type, Authorization',
// };

// // Separate OPTIONS handler
// export async function OPTIONS() {
//   return new NextResponse(null, {
//     headers: corsHeaders,
//     status: 204,
//   });
// }

// // Main DELETE handler
// export async function DELETE(request: NextRequest) {
//   try {
//     const deleteResult = await prisma.body.deleteMany({
//       where: {
//         createdAt: {
//           lt: new Date('2025-02-17'),
//         },
//       },
//     });

//     return new NextResponse(
//       JSON.stringify({
//         success: true,
//         message: 'All bodies created before February 17, 2025 have been deleted.',
//         count: deleteResult.count,
//       }),
//       {
//         status: 200,
//         headers: corsHeaders,
//       }
//     );
//   } catch (error) {
//     console.error('[ERROR] DELETE operation failed:', error);
//     return new NextResponse(
//       JSON.stringify({
//         success: false,
//         error: 'Failed to delete bodies',
//         details: error instanceof Error ? error.message : 'Unknown error',
//       }),
//       {
//         status: 500,
//         headers: corsHeaders,
//       }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }
