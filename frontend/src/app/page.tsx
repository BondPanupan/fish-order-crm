'use client';

import { useState, useEffect, useCallback, Fragment } from 'react';
import styles from './page.module.css';
import type { OrderRecord } from '@/types/order';
import { fetchAllOrders, fetchOneOrder } from '@/lib/api/orders/orders.api';

function statusClass(status: string) {
  if (status === 'fulfilled') return styles.badgeFulfilled;
  if (status === 'cancelled') return styles.badgeCancelled;
  return styles.badgePending;
}

export default function Home() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<OrderRecord | null>(null);
  const [expandLoading, setExpandLoading] = useState(false);

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

  async function toggleExpand(id: string) {
    if (expandedId === id) {
      setExpandedId(null);
      setExpandedOrder(null);
      return;
    }
    setExpandedId(id);
    setExpandLoading(true);
    try {
      setExpandedOrder(await fetchOneOrder(id));
    } catch {
      setExpandedOrder(null);
    } finally {
      setExpandLoading(false);
    }
  }

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
                <th className={styles.th}>Remark</th>
                <th className={`${styles.th} ${styles.thCenter}`}>Lines</th>
                <th className={styles.th}>Created</th>
                <th className={`${styles.th} ${styles.thCenter}`}>Detail</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => {
                const isExpanded = expandedId === o.id;
                return (
                  <Fragment key={o.id}>
                    <tr className={isExpanded ? styles.trExpanded : i % 2 === 0 ? styles.trEven : styles.trOdd}>
                      <td className={styles.td}><span className={styles.code}>{o.code}</span></td>
                      <td className={styles.td}>
                        <span className={styles.code}>{o.customer.code}</span>
                        {o.customer.name && <span className={styles.subtext}> {o.customer.name}</span>}
                      </td>
                      <td className={styles.td}>{o.remark ?? '—'}</td>
                      <td className={`${styles.td} ${styles.tdCenter}`}>{o._count?.subOrders ?? 0}</td>
                      <td className={styles.td}>
                        {new Date(o.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className={`${styles.td} ${styles.tdCenter}`}>
                        <button onClick={() => toggleExpand(o.id)} className={styles.expandBtn}>
                          {isExpanded ? '▲ Hide' : '▼ Lines'}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className={styles.expandRow}>
                        <td colSpan={6}>
                          <div className={styles.subPanel}>
                            {expandLoading ? (
                              <p className={styles.muted}>Loading…</p>
                            ) : expandedOrder?.subOrders && expandedOrder.subOrders.length > 0 ? (
                              <table className={styles.subTable}>
                                <thead>
                                  <tr>
                                    <th className={styles.subTh}>Line</th>
                                    <th className={styles.subTh}>Item</th>
                                    <th className={styles.subTh}>Warehouse</th>
                                    <th className={styles.subTh}>Supplier</th>
                                    <th className={styles.subTh}>Qty</th>
                                    <th className={styles.subTh}>Order Type</th>
                                    <th className={styles.subTh}>Date</th>
                                    <th className={styles.subTh}>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {expandedOrder.subOrders.map((s) => (
                                    <tr key={s.id}>
                                      <td className={styles.subTd}><span className={styles.code}>{s.code}</span></td>
                                      <td className={styles.subTd}>
                                        <span className={styles.code}>{s.item.code}</span>
                                        {s.item.name && <span className={styles.subtext}> {s.item.name}</span>}
                                      </td>
                                      <td className={styles.subTd}><span className={styles.code}>{s.warehouse.code}</span></td>
                                      <td className={styles.subTd}><span className={styles.code}>{s.supplier.code}</span></td>
                                      <td className={styles.subTd}>{Number(s.requestQuantity).toLocaleString()} {s.item.unit}</td>
                                      <td className={styles.subTd}>{s.orderType.code}</td>
                                      <td className={styles.subTd}>
                                        {new Date(s.createDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                      </td>
                                      <td className={styles.subTd}>
                                        <span className={`${styles.badge} ${statusClass(s.status)}`}>{s.status}</span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <p className={styles.muted}>No lines.</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
