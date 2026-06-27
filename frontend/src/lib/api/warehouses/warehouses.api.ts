import type { Warehouse, CreateWarehouseDto, UpdateWarehouseDto } from '@/types/warehouse';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function fetchAllWarehouses(): Promise<Warehouse[]> {
  const res = await fetch(`${API}/warehouses`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function createWarehouse(dto: CreateWarehouseDto): Promise<Warehouse> {
  const res = await fetch(`${API}/warehouses`, {
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

export async function updateWarehouse(id: string, dto: UpdateWarehouseDto): Promise<Warehouse> {
  const res = await fetch(`${API}/warehouses/${id}`, {
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

export async function deleteWarehouse(id: string): Promise<void> {
  const res = await fetch(`${API}/warehouses/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}
