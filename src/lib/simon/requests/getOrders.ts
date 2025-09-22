import {getCurrentStuff} from '@/app/lib/current';

export async function getOrders() {
  try {
    // Retrieve the store ID from your current context
    const currentStuff = await getCurrentStuff();
    const store_id = currentStuff?.store?.id;

    if (!store_id) {
      console.error('[GET ORDERS] No store found in currentStuff');
      return [];
    }

    // Send a GET request to "/api/orders/simon", passing store_id as a query param
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/orders/simon?store_id=${store_id}`, {
      method: 'GET',
    });
    if (!response.ok) {
      console.error('[GET ORDERS] Request failed:', response.statusText);
      return [];
    }

    // Parse and return the retrieved orders
    const data = await response.json();
    console.log('[GET ORDERS] Retrieved orders:', data);
    return data.orders || [];
  } catch (error) {
    console.error('[GET ORDERS ERROR]', error);
    return [];
  }
}
