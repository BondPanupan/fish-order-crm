import type { PriceRecord, CreatePriceDto, UpdatePriceDto } from '@/types/price';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function fetchAllPrices(): Promise<PriceRecord[]> {
  const res = await fetch(`${API}/prices`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function createPrice(dto: CreatePriceDto): Promise<PriceRecord> {
  const res = await fetch(`${API}/prices`, {
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

export async function updatePrice(id: string, dto: UpdatePriceDto): Promise<PriceRecord> {
  const res = await fetch(`${API}/prices/${id}`, {
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

export async function deletePrice(id: string): Promise<void> {
  const res = await fetch(`${API}/prices/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}
