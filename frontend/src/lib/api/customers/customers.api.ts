import type { Customer, CreateCustomerDto, UpdateCustomerDto } from '@/types/customer';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function fetchAllCustomers(): Promise<Customer[]> {
  const res = await fetch(`${API}/customers`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function createCustomer(dto: CreateCustomerDto): Promise<Customer> {
  const res = await fetch(`${API}/customers`, {
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

export async function updateCustomer(id: string, dto: UpdateCustomerDto): Promise<Customer> {
  const res = await fetch(`${API}/customers/${id}`, {
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

export async function deleteCustomer(id: string): Promise<void> {
  const res = await fetch(`${API}/customers/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}
