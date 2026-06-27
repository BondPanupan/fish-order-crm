import type { OrderType } from '@/types/order-type';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function fetchAllOrderTypes(): Promise<OrderType[]> {
  const res = await fetch(`${API}/order-types`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
