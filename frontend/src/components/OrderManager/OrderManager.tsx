'use client';

import { useState, useEffect, useCallback, Fragment } from 'react';
import styles from './OrderManager.module.css';
import type { OrderRecord, OrderFormState, SubOrderFormLine } from '@/types/order';
import type { Customer } from '@/types/customer';
import type { Item } from '@/types/item';
import type { Supplier } from '@/types/supplier';
import type { Warehouse } from '@/types/warehouse';
import type { OrderType } from '@/types/order-type';
import { fetchAllOrders, fetchOneOrder, createOrder, updateOrder, deleteOrder } from '@/lib/api/orders/orders.api';
import { fetchAllCustomers } from '@/lib/api/customers/customers.api';
import { fetchAllItems } from '@/lib/api/items/items.api';
import { fetchAllSuppliers } from '@/lib/api/suppliers/suppliers.api';
import { fetchAllOrderTypes } from '@/lib/api/order-types/order-types.api';
import { fetchAllWarehouses } from '@/lib/api/warehouses/warehouses.api';
import ConfirmModal from '@/components/ConfirmModal/ConfirmModal';

const today = () => new Date().toISOString().slice(0, 10);

const emptyLine = (): SubOrderFormLine => ({
  itemId: '',
  warehouseId: '',
  supplierId: '',
  requestQuantity: '',
  orderTypeId: '',
  createDate: today(),
});

const emptyForm = (): OrderFormState => ({
  code: '',
  customerId: '',
  remark: '',
  subOrders: [emptyLine()],
});

function statusClass(status: string) {
  if (status === 'fulfilled') return styles.badgeFulfilled;
  if (status === 'cancelled') return styles.badgeCancelled;
  return styles.badgePending;
}

export default function OrderManager() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [orderTypes, setOrderTypes] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editTarget, setEditTarget] = useState<OrderRecord | null>(null);
  const [form, setForm] = useState<OrderFormState>(emptyForm());
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<OrderRecord | null>(null);
  const [expandLoading, setExpandLoading] = useState(false);

  const [search, setSearch] = useState('');

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ords, custs, itms, sups, whs, ots] = await Promise.all([
        fetchAllOrders(),
        fetchAllCustomers(),
        fetchAllItems(),
        fetchAllSuppliers(),
        fetchAllWarehouses(),
        fetchAllOrderTypes(),
      ]);
      setOrders(ords);
      setCustomers(custs);
      setItems(itms);
      setSuppliers(sups);
      setWarehouses(whs);
      setOrderTypes(ots);
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
      const detail = await fetchOneOrder(id);
      setExpandedOrder(detail);
    } catch {
      setExpandedOrder(null);
    } finally {
      setExpandLoading(false);
    }
  }

  function openCreate() {
    setForm(emptyForm());
    setFormError(null);
    setModal('create');
  }

  function openEdit(order: OrderRecord) {
    setEditTarget(order);
    setForm({ code: order.code, customerId: order.customerId, remark: order.remark ?? '', subOrders: [emptyLine()] });
    setFormError(null);
    setModal('edit');
  }

  function closeModal() {
    setModal(null);
    setEditTarget(null);
    setFormError(null);
  }

  function setLine(index: number, patch: Partial<SubOrderFormLine>) {
    setForm((f) => {
      const lines = f.subOrders.map((l, i) => (i === index ? { ...l, ...patch } : l));
      return { ...f, subOrders: lines };
    });
  }

  function addLine() {
    setForm((f) => ({ ...f, subOrders: [...f.subOrders, emptyLine()] }));
  }

  function removeLine(index: number) {
    setForm((f) => ({ ...f, subOrders: f.subOrders.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      if (modal === 'edit') {
        await updateOrder(editTarget!.id, { remark: form.remark || undefined });
      } else {
        if (form.subOrders.length === 0) {
          setFormError('Add at least one order line.');
          return;
        }
        await createOrder({
          code: form.code.trim(),
          customerId: form.customerId,
          remark: form.remark.trim() || undefined,
          subOrders: form.subOrders.map((l) => ({
            itemId: l.itemId,
            warehouseId: l.warehouseId,
            supplierId: l.supplierId,
            requestQuantity: Number(l.requestQuantity),
            orderTypeId: l.orderTypeId,
            createDate: l.createDate,
          })),
        });
      }
      closeModal();
      loadAll();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : String(e));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    setConfirmId(null);
    setDeletingId(id);
    if (expandedId === id) { setExpandedId(null); setExpandedOrder(null); }
    try {
      await deleteOrder(id);
      loadAll();
    } catch (e) {
      alert(e instanceof Error ? e.message : String(e));
    } finally {
      setDeletingId(null);
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
        <button onClick={openCreate} className={styles.btnPrimary}>+ New Order</button>
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
          <button onClick={loadAll} className={`${styles.btnSecondary} ${styles.errorRetry}`}>Retry</button>
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
                <th className={styles.th}>Code</th>
                <th className={styles.th}>Customer</th>
                <th className={styles.th}>Remark</th>
                <th className={`${styles.th} ${styles.thCenter}`}>Lines</th>
                <th className={styles.th}>Created</th>
                <th className={`${styles.th} ${styles.thCenter}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => {
                const isExpanded = expandedId === o.id;
                return (
                  <Fragment key={o.id}>
                    <tr className={isExpanded ? styles.trExpanded : i % 2 === 0 ? styles.trEven : styles.trOdd}>
                      <td className={styles.td}>
                        <span className={styles.code}>{o.code}</span>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.code}>{o.customer.code}</span>
                        {o.customer.name && <span className={styles.subtext}> {o.customer.name}</span>}
                      </td>
                      <td className={styles.td}>{o.remark ?? '—'}</td>
                      <td className={`${styles.td} ${styles.tdCenter}`}>{o._count?.subOrders ?? 0}</td>
                      <td className={styles.td}>
                        {new Date(o.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className={`${styles.td} ${styles.tdActions}`}>
                        <button onClick={() => toggleExpand(o.id)} className={styles.expandBtn}>
                          {isExpanded ? '▲ Hide' : '▼ Lines'}
                        </button>
                        <button onClick={() => openEdit(o)} className={`${styles.btnSecondary} ${styles.actionEdit}`}>Edit</button>
                        <button
                          onClick={() => setConfirmId(o.id)}
                          disabled={deletingId === o.id}
                          className={styles.btnDanger}
                        >
                          {deletingId === o.id ? '…' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className={styles.expandRow}>
                        <td colSpan={6}>
                          <div className={styles.subOrderPanel}>
                            {expandLoading ? (
                              <p className={styles.muted}>Loading lines…</p>
                            ) : expandedOrder?.subOrders && expandedOrder.subOrders.length > 0 ? (
                              <>
                                <div className={styles.subOrderTitle}>Order Lines</div>
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
                                        <td className={styles.subTd}>
                                          <span className={styles.code}>{s.warehouse.code}</span>
                                        </td>
                                        <td className={styles.subTd}>
                                          <span className={styles.code}>{s.supplier.code}</span>
                                        </td>
                                        <td className={styles.subTd}>
                                          {Number(s.requestQuantity).toLocaleString()} {s.item.unit}
                                        </td>
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
                              </>
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

      {confirmId && (
        <ConfirmModal
          message="Delete this order and all its lines? This cannot be undone."
          onConfirm={() => handleDelete(confirmId)}
          onCancel={() => setConfirmId(null)}
        />
      )}

      {modal && (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.dialogTitle}>{modal === 'create' ? 'New Order' : 'Edit Order'}</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <label className={styles.label}>
                  Order Code <span className={styles.required}>*</span>
                  <input
                    className={styles.input}
                    value={form.code}
                    onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                    required
                    placeholder="e.g. ORD-001"
                    disabled={modal === 'edit'}
                  />
                </label>
                <label className={styles.label}>
                  Customer <span className={styles.required}>*</span>
                  <select
                    className={styles.input}
                    value={form.customerId}
                    onChange={(e) => setForm((f) => ({ ...f, customerId: e.target.value }))}
                    required
                    disabled={modal === 'edit'}
                  >
                    <option value="">— select customer —</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code}{c.name ? ` — ${c.name}` : ''}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className={styles.label}>
                Remark
                <input
                  className={styles.input}
                  value={form.remark}
                  onChange={(e) => setForm((f) => ({ ...f, remark: e.target.value }))}
                  placeholder="Optional note"
                />
              </label>

              {modal === 'create' && (
                <div className={styles.linesSection}>
                  <div className={styles.linesSectionHeader}>
                    <span className={styles.linesSectionTitle}>Order Lines <span className={styles.required}>*</span></span>
                    <button type="button" onClick={addLine} className={styles.btnSecondary}>+ Add Line</button>
                  </div>
                  {form.subOrders.map((line, idx) => (
                    <div key={idx} className={styles.lineCard}>
                      <div className={styles.lineCardHeader}>
                        <span className={styles.lineCardTitle}>Line {idx + 1}</span>
                        {form.subOrders.length > 1 && (
                          <button type="button" onClick={() => removeLine(idx)} className={styles.lineRemoveBtn}>Remove</button>
                        )}
                      </div>
                      <div className={styles.formRow}>
                        <label className={styles.label}>
                          Item <span className={styles.required}>*</span>
                          <select
                            className={styles.input}
                            value={line.itemId}
                            onChange={(e) => setLine(idx, { itemId: e.target.value })}
                            required
                          >
                            <option value="">— item —</option>
                            {items.map((it) => (
                              <option key={it.id} value={it.id}>
                                {it.code}{it.name ? ` — ${it.name}` : ''}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className={styles.label}>
                          Order Type <span className={styles.required}>*</span>
                          <select
                            className={styles.input}
                            value={line.orderTypeId}
                            onChange={(e) => setLine(idx, { orderTypeId: e.target.value })}
                            required
                          >
                            <option value="">— type —</option>
                            {orderTypes.map((ot) => (
                              <option key={ot.id} value={ot.id}>
                                {ot.code}{ot.name ? ` — ${ot.name}` : ''}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <div className={styles.formRow}>
                        <label className={styles.label}>
                          Warehouse <span className={styles.required}>*</span>
                          <select
                            className={styles.input}
                            value={line.warehouseId}
                            onChange={(e) => setLine(idx, { warehouseId: e.target.value })}
                            required
                          >
                            <option value="">— warehouse —</option>
                            {warehouses.map((w) => (
                              <option key={w.id} value={w.id}>
                                {w.code}{w.name ? ` — ${w.name}` : ''}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className={styles.label}>
                          Supplier <span className={styles.required}>*</span>
                          <select
                            className={styles.input}
                            value={line.supplierId}
                            onChange={(e) => setLine(idx, { supplierId: e.target.value })}
                            required
                          >
                            <option value="">— supplier —</option>
                            {suppliers.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.code}{s.name ? ` — ${s.name}` : ''}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <div className={styles.formRow}>
                        <label className={styles.label}>
                          Quantity <span className={styles.required}>*</span>
                          <input
                            className={styles.input}
                            type="number"
                            min="0"
                            step="0.01"
                            value={line.requestQuantity}
                            onChange={(e) => setLine(idx, { requestQuantity: e.target.value })}
                            required
                            placeholder="0.00"
                          />
                        </label>
                        <label className={styles.label}>
                          Date <span className={styles.required}>*</span>
                          <input
                            className={styles.input}
                            type="date"
                            value={line.createDate}
                            onChange={(e) => setLine(idx, { createDate: e.target.value })}
                            required
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {formError && <div className={styles.errorBox}>{formError}</div>}
              <div className={styles.formActions}>
                <button type="button" onClick={closeModal} className={styles.btnSecondary} disabled={submitting}>Cancel</button>
                <button type="submit" className={styles.btnPrimary} disabled={submitting}>
                  {submitting ? 'Saving…' : modal === 'create' ? 'Create' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
