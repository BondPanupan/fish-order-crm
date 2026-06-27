import type { InventoryRecord, CreateInventoryDto, UpdateInventoryDto } from '@/types/inventory';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function fetchAllInventory(): Promise<InventoryRecord[]> {
  const res = await fetch(`${API}/inventory`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function createInventory(dto: CreateInventoryDto): Promise<InventoryRecord> {
  const res = await fetch(`${API}/inventory`, {
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

export async function updateInventory(id: string, dto: UpdateInventoryDto): Promise<InventoryRecord> {
  const res = await fetch(`${API}/inventory/${id}`, {
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

export async function deleteInventory(id: string): Promise<void> {
  const res = await fetch(`${API}/inventory/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}
