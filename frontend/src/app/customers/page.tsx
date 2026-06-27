type Customer = {
  id: string;
  code: string;
  name: string | null;
  creditLimit: string;
  createdAt: string;
  _count: { orders: number };
};

type FetchResult =
  | { ok: true; customers: Customer[] }
  | { ok: false; error: string; url: string };

async function getCustomers(): Promise<FetchResult> {
  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
  const url = `${apiUrl}/customers`;
  console.log('url', url);
  
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status} ${res.statusText}`, url };
    return { ok: true, customers: await res.json() };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? `${e.message} — cause: ${String((e as NodeJS.ErrnoException).cause ?? 'unknown')}` : String(e), url };
  }
}

export default async function CustomersPage() {
  const result = await getCustomers();

  if (!result.ok) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'var(--font-geist-sans)' }}>
        <h1 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 600 }}>Customers</h1>
        <div style={{ background: '#fff3f3', border: '1px solid #f5c0c0', borderRadius: '6px', padding: '1rem 1.25rem' }}>
          <p style={{ fontWeight: 600, marginBottom: '0.4rem' }}>Could not reach the backend</p>
          <p style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#c00' }}>{result.error}</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#555' }}>URL attempted: <code>{result.url}</code></p>
        </div>
      </div>
    );
  }

  const customers = result.customers;

  return (
    <div style={{ padding: '2rem', fontFamily: 'var(--font-geist-sans)' }}>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600 }}>
        Customers
      </h1>

      {customers.length === 0 ? (
        <p style={{ color: '#666' }}>No customers found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                <th style={thStyle}>Code</th>
                <th style={thStyle}>Name</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Credit Limit</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Orders</th>
                <th style={thStyle}>Created At</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr
                  key={c.id}
                  style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}
                >
                  <td style={tdStyle}>
                    <span style={{ fontFamily: 'var(--font-geist-mono)', fontWeight: 500 }}>
                      {c.code}
                    </span>
                  </td>
                  <td style={tdStyle}>{c.name ?? '—'}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    {Number(c.creditLimit).toLocaleString('th-TH', {
                      style: 'currency',
                      currency: 'THB',
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{c._count.orders}</td>
                  <td style={tdStyle}>
                    {new Date(c.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
  borderBottom: '2px solid #e0e0e0',
  fontWeight: 600,
  whiteSpace: 'nowrap',
};

const tdStyle: React.CSSProperties = {
  padding: '0.65rem 1rem',
  borderBottom: '1px solid #ececec',
  verticalAlign: 'middle',
};
