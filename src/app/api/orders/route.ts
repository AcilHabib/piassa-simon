// import {NextRequest, NextResponse} from 'next/server';
// import {PrismaClient} from '@prisma/client';

// const prisma = new PrismaClient();

// export async function DELETE(request: NextRequest) {
//   try {
//     // Deletes all orders in the Order collection
//     await prisma.order.deleteMany({});

//     return NextResponse.json({
//       success: true,
//       message: 'All orders have been deleted.',
//     });
//   } catch (error: any) {
//     console.error('[ORDERS] Delete All Orders Error:', error);
//     return NextResponse.json({success: false, error: error.message}, {status: 500});
//   }
// }
