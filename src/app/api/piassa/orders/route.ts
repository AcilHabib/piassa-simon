import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

type GetOrderByPhone = NextRequest & {
    nextUrl: {
      searchParams: {
        get: (key: string) => string | null;
      };
    };
  };

  const prisma = new PrismaClient();

export const GET = async (request: GetOrderByPhone) => {
    const {searchParams} = request.nextUrl;
    const phone = searchParams.get('phone');
    
    try {
        if (!phone) {
            return NextResponse.json({success: false, error: 'Phone is required'}, {status: 400});
        }
    
        const Orders = await prisma.order.findMany({
            include: {
                store: true,
            }
        });

        Orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        const orders = Orders.filter(order => order.client?.phone === phone);
        

        if (orders.length === 0) {
            return NextResponse.json({success: false, error: 'No orders found for this phone number'}, {status: 404});
        }
        
        for (const order of orders) {
            if (!order.items) continue;
        
            for (const item of order.items) {
                const partId = item.id;
                if (!partId) continue;
        
                console.log('partId', partId);
        
                const part = await prisma.body.findUnique({
                    where: {
                        id: partId,
                    },
                });
        
                if (!part) continue;
        
                item.designation = part.designation;
                item.org_designation = part.org_designation;
            }
        
            console.log(order); // Now includes updated items
        }
        
        return NextResponse.json({ success: true, orders }, { status: 200 });
        
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({success: false, error}, {status: 500});
    }
}