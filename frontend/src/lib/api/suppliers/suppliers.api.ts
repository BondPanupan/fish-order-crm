import type { Supplier, CreateSupplierDto, UpdateSupplierDto } from '@/types/supplier';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function fetchAllSuppliers(): Promise<Supplier[]> {
  const res = await fetch(`${API}/suppliers`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function createSupplier(dto: CreateSupplierDto): Promise<Supplier> {
  const res = await fetch(`${API}/suppliers`, {
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

export async function updateSupplier(id: string, dto: UpdateSupplierDto): Promise<Supplier> {
  const res = await fetch(`${API}/suppliers/${id}`, {
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

export async function deleteSupplier(id: string): Promise<void> {
  const res = await fetch(`${API}/suppliers/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}
