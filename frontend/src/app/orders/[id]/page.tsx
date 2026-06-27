'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { OrderRecord } from '@/types/order';
import { fetchOneOrder } from '@/lib/api/orders/orders.api';
import styles from './page.module.css';

function statusClass(status: string) {
  if (status === 'fulfilled') return styles.badgeFulfilled;
  if (status === 'cancelled') return styles.badgeCancelled;
  return styles.badgePending;
}

function fmt(n: number | null) {
  if (n === null) return '—';
  return n.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchOneOrder(id)
      .then(setOrder)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [id]);

  const grandTotal = order?.subOrders?.reduce(
    (sum, s) => sum + (s.totalPrice ?? 0),
    0,
  ) ?? 0;

  return (
    <div className={styles.page}>
      <button onClick={() => router.back()} className={styles.backBtn}>
        Back
      </button>

      {loading && <p className={styles.muted}>Loading…</p>}

      {error && (
        <div className={styles.errorBox}><strong>Error:</strong> {error}</div>
      )}

      {!loading && !error && order && (
        <>
          {/* ── Header card ── */}
          <div className={styles.headerCard}>
            <div className={styles.headerTop}>
              <h1 className={styles.orderCode}>{order.code}</h1>
            </div>
            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Customer</span>
                <span className={styles.metaValue}>
                  <span className={styles.mono}>{order.customer.code}</span>
                  {order.customer.name && ` — ${order.customer.name}`}
                </span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Created</span>
                <span className={styles.metaValue}>
                  {new Date(order.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit', month: 'short', year: 'numeric',
                  })}
                </span>
              </div>
              {order.remark && (
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Remark</span>
                  <span className={styles.metaValue}>{order.remark}</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Lines table ── */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Order Lines</h2>

            {!order.subOrders || order.subOrders.length === 0 ? (
              <p className={styles.muted}>No lines.</p>
            ) : (
              <>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.th}>Line</th>
                        <th className={styles.th}>Item</th>
                        <th className={styles.th}>Warehouse</th>
                        <th className={styles.th}>Supplier</th>
                        <th className={styles.th}>Order Type</th>
                        <th className={styles.th}>Date</th>
                        <th className={`${styles.th} ${styles.thRight}`}>Qty</th>
                        <th className={`${styles.th} ${styles.thRight}`}>Unit Price</th>
                        <th className={`${styles.th} ${styles.thRight}`}>Total</th>
                        <th className={`${styles.th} ${styles.thCenter}`}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.subOrders.map((s, i) => (
                        <tr key={s.id} className={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                          <td className={styles.td}><span className={styles.mono}>{s.code}</span></td>
                          <td className={styles.td}>
                            <span className={styles.mono}>{s.item.code}</span>
                            {s.item.name && <span className={styles.sub}> {s.item.name}</span>}
                          </td>
                          <td className={styles.td}><span className={styles.mono}>{s.warehouse.code}</span></td>
                          <td className={styles.td}><span className={styles.mono}>{s.supplier.code}</span></td>
                          <td className={styles.td}>{s.orderType.code}</td>
                          <td className={styles.td}>
                            {new Date(s.createDate).toLocaleDateString('en-GB', {
                              day: '2-digit', month: 'short', year: 'numeric',
                            })}
                          </td>
                          <td className={`${styles.td} ${styles.tdRight}`}>
                            {Number(s.requestQuantity).toLocaleString()} {s.item.unit}
                          </td>
                          <td className={`${styles.td} ${styles.tdRight}`}>{fmt(s.unitPrice)}</td>
                          <td className={`${styles.td} ${styles.tdRight} ${styles.totalCell}`}>{fmt(s.totalPrice)}</td>
                          <td className={`${styles.td} ${styles.tdCenter}`}>
                            <span className={`${styles.badge} ${statusClass(s.status)}`}>{s.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className={styles.grandTotal}>
                  <span className={styles.grandTotalLabel}>Grand Total</span>
                  <span className={styles.grandTotalValue}>{fmt(grandTotal)}</span>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
