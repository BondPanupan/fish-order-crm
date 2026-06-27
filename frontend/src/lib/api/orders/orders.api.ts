import type { OrderRecord, CreateOrderDto, UpdateOrderDto } from '@/types/order';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function fetchAllOrders(): Promise<OrderRecord[]> {
  const res = await fetch(`${API}/orders`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchOneOrder(id: string): Promise<OrderRecord> {
  const res = await fetch(`${API}/orders/${id}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function createOrder(dto: CreateOrderDto): Promise<OrderRecord> {
  const res = await fetch(`${API}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export async function updateOrder(id: string, dto: UpdateOrderDto): Promise<OrderRecord> {
  const res = await fetch(`${API}/orders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export async function deleteOrder(id: string): Promise<void> {
  const res = await fetch(`${API}/orders/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}
