'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './PriceManager.module.css';
import type { PriceRecord, PriceFormState } from '@/types/price';
import type { Item } from '@/types/item';
import type { Supplier } from '@/types/supplier';
import type { OrderType } from '@/types/order-type';
import { fetchAllPrices, createPrice, updatePrice, deletePrice } from '@/lib/api/prices/prices.api';
import { fetchAllItems } from '@/lib/api/items/items.api';
import { fetchAllSuppliers } from '@/lib/api/suppliers/suppliers.api';
import { fetchAllOrderTypes } from '@/lib/api/order-types/order-types.api';
import ConfirmModal from '@/components/ConfirmModal/ConfirmModal';

const NONE = '__none__';

const emptyForm: PriceFormState = {
  itemId: '',
  supplierId: '',
  orderTypeId: NONE,
  unitPrice: '',
};

export default function PriceManager() {
  const [prices, setPrices] = useState<PriceRecord[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [orderTypes, setOrderTypes] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editTarget, setEditTarget] = useState<PriceRecord | null>(null);
  const [form, setForm] = useState<PriceFormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const [search, setSearch] = useState('');

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, itms, sups, ots] = await Promise.all([
        fetchAllPrices(),
        fetchAllItems(),
        fetchAllSuppliers(),
        fetchAllOrderTypes(),
      ]);
      setPrices(p);
      setItems(itms);
      setSuppliers(sups);
      setOrderTypes(ots);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  function openCreate() {
    setForm({
      itemId: items[0]?.id ?? '',
      supplierId: suppliers[0]?.id ?? '',
      orderTypeId: NONE,
      unitPrice: '',
    });
    setFormError(null);
    setModal('create');
  }

  function openEdit(price: PriceRecord) {
    setEditTarget(price);
    setForm({
      itemId: price.itemId,
      supplierId: price.supplierId,
      orderTypeId: price.orderTypeId ?? NONE,
      unitPrice: price.unitPrice,
    });
    setFormError(null);
    setModal('edit');
  }

  function closeModal() {
    setModal(null);
    setEditTarget(null);
    setFormError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    const orderTypeId = form.orderTypeId === NONE ? null : form.orderTypeId;
    try {
      if (modal === 'edit') {
        await updatePrice(editTarget!.id, {
          orderTypeId,
          unitPrice: Number(form.unitPrice),
        });
      } else {
        await createPrice({
          itemId: form.itemId,
          supplierId: form.supplierId,
          orderTypeId,
          unitPrice: Number(form.unitPrice),
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
    try {
      await deletePrice(id);
      loadAll();
    } catch (e) {
      alert(e instanceof Error ? e.message : String(e));
    } finally {
      setDeletingId(null);
    }
  }

  const q = search.toLowerCase();
  const filtered = prices.filter(
    (p) =>
      !q ||
      p.item.code.toLowerCase().includes(q) ||
      (p.item.name ?? '').toLowerCase().includes(q) ||
      p.supplier.code.toLowerCase().includes(q) ||
      (p.supplier.name ?? '').toLowerCase().includes(q) ||
      (p.orderType?.code ?? '').toLowerCase().includes(q),
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Prices</h1>
        <button onClick={openCreate} className={styles.btnPrimary}>+ New Price</button>
      </div>

      <div className={styles.toolbar}>
        <input
          className={styles.search}
          placeholder="Search item, supplier, order type…"
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
        <p className={styles.muted}>{search ? 'No results.' : 'No prices yet.'}</p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Item</th>
                <th className={styles.th}>Supplier</th>
                <th className={styles.th}>Order Type</th>
                <th className={`${styles.th} ${styles.thRight}`}>Unit Price</th>
                <th className={`${styles.th} ${styles.thCenter}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} className={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                  <td className={styles.td}>
                    <span className={styles.code}>{p.item.code}</span>
                    {p.item.name && <span className={styles.subtext}> {p.item.name}</span>}
                  </td>
                  <td className={styles.td}>
                    <span className={styles.code}>{p.supplier.code}</span>
                    {p.supplier.name && <span className={styles.subtext}> {p.supplier.name}</span>}
                  </td>
                  <td className={styles.td}>
                    {p.orderType ? (
                      <>
                        <span className={styles.code}>{p.orderType.code}</span>
                      </>
                    ) : (
                      <span className={styles.code}>Base Price</span>
                    )}
                  </td>
                  <td className={`${styles.td} ${styles.tdRight}`}>
                    {Number(p.unitPrice).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className={`${styles.td} ${styles.tdActions}`}>
                    <button onClick={() => openEdit(p)} className={`${styles.btnSecondary} ${styles.actionEdit}`}>Edit</button>
                    <button
                      onClick={() => setConfirmId(p.id)}
                      disabled={deletingId === p.id}
                      className={styles.btnDanger}
                    >
                      {deletingId === p.id ? '…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {confirmId && (
        <ConfirmModal
          message="Delete this price entry? This cannot be undone."
          onConfirm={() => handleDelete(confirmId)}
          onCancel={() => setConfirmId(null)}
        />
      )}

      {modal && (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.dialogTitle}>
              {modal === 'create' ? 'New Price' : 'Edit Price'}
            </h2>
            <form onSubmit={handleSubmit}>
              <label className={styles.label}>
                Item <span className={styles.required}>*</span>
                <select
                  className={styles.input}
                  value={form.itemId}
                  onChange={(e) => setForm((f) => ({ ...f, itemId: e.target.value }))}
                  required
                  disabled={modal === 'edit'}
                >
                  <option value="">— select item —</option>
                  {items.map((it) => (
                    <option key={it.id} value={it.id}>
                      {it.code}{it.name ? ` — ${it.name}` : ''}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.label}>
                Supplier <span className={styles.required}>*</span>
                <select
                  className={styles.input}
                  value={form.supplierId}
                  onChange={(e) => setForm((f) => ({ ...f, supplierId: e.target.value }))}
                  required
                  disabled={modal === 'edit'}
                >
                  <option value="">— select supplier —</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code}{s.name ? ` — ${s.name}` : ''}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.label}>
                Order Type
                <select
                  className={styles.input}
                  value={form.orderTypeId}
                  onChange={(e) => setForm((f) => ({ ...f, orderTypeId: e.target.value }))}
                >
                  <option value={NONE}>— Base Price —</option>
                  {orderTypes.map((ot) => (
                    <option key={ot.id} value={ot.id}>
                      {ot.code}{ot.name ? ` — ${ot.name}` : ''}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.label}>
                Unit Price <span className={styles.required}>*</span>
                <input
                  className={styles.input}
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.unitPrice}
                  onChange={(e) => setForm((f) => ({ ...f, unitPrice: e.target.value }))}
                  required
                />
              </label>
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
