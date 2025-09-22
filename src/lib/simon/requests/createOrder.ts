export interface OrderItem {
  id?: string;
  quantity: number;
  sellingPrice: number;
}

export interface CreateOrderPayload {
  ref: string;
  items: OrderItem[];
  total: number;
}

export async function createOrder(payload: CreateOrderPayload): Promise<any> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/orders/simon`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`Failed to create order: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}
