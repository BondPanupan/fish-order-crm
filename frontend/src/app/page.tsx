'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import type { OrderRecord } from '@/types/order';
import { fetchAllOrders } from '@/lib/api/orders/orders.api';

export default function Home() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setOrders(await fetchAllOrders());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const q = search.toLowerCase();
  const filtered = orders.filter(
    (o) =>
      !q ||
      o.code.toLowerCase().includes(q) ||
      o.customer.code.toLowerCase().includes(q) ||
      (o.customer.name ?? '').toLowerCase().includes(q) ||
      (o.remark ?? '').toLowerCase().includes(q),
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Orders</h1>
      </div>

      <div className={styles.toolbar}>
        <input
          className={styles.search}
          placeholder="Search order code, customer…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <p className={styles.muted}>Loading…</p>}

      {error && (
        <div className={styles.errorBox}>
          <strong>Error:</strong> {error}
          <button onClick={loadAll} className={styles.retryBtn}>Retry</button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className={styles.muted}>{search ? 'No results.' : 'No orders yet.'}</p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Order</th>
                <th className={styles.th}>Customer</th>
                <th className={styles.th}>Order Type</th>
                <th className={styles.th}>Remark</th>
                <th className={`${styles.th} ${styles.thCenter}`}>Lines</th>
                <th className={styles.th}>Created</th>
                <th className={`${styles.th} ${styles.thCenter}`}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => (
                <tr key={o.id} className={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                  <td className={styles.td}><span className={styles.code}>{o.code}</span></td>
                  <td className={styles.td}>
                    <span className={styles.code}>{o.customer.code}</span>
                    {o.customer.name && <span className={styles.subtext}> {o.customer.name}</span>}
                  </td>
                  <td className={styles.td}>
                    {o.orderTypes && o.orderTypes.length > 0
                      ? o.orderTypes.map((ot) => (
                          <span key={ot.code} className={styles.orderTypeTag}>
                            {ot.code}{ot.name ? ` — ${ot.name}` : ''}
                          </span>
                        ))
                      : <span className={styles.muted}>—</span>}
                  </td>
                  <td className={styles.td}>{o.remark ?? '—'}</td>
                  <td className={`${styles.td} ${styles.tdCenter}`}>{o._count?.subOrders ?? 0}</td>
                  <td className={styles.td}>
                    {new Date(o.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className={`${styles.td} ${styles.tdCenter}`}>
                    <Link href={`/orders/${o.id}`} className={styles.viewLink}>View</Link>
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
