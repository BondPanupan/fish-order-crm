'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './InventoryManager.module.css';
import type { InventoryRecord, InventoryFormState } from '@/types/inventory';
import type { Item } from '@/types/item';
import type { Supplier } from '@/types/supplier';
import type { Warehouse } from '@/types/warehouse';
import {
  fetchAllInventory,
  createInventory,
  updateInventory,
  deleteInventory,
} from '@/lib/api/inventory/inventory.api';
import { fetchAllItems } from '@/lib/api/items/items.api';
import { fetchAllSuppliers } from '@/lib/api/suppliers/suppliers.api';
import { fetchAllWarehouses } from '@/lib/api/warehouses/warehouses.api';

const emptyForm: InventoryFormState = {
  supplierId: '',
  warehouseId: '',
  itemId: '',
  remainingQuantity: '0',
};

export default function InventoryManager() {
  const [inventory, setInventory] = useState<InventoryRecord[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editTarget, setEditTarget] = useState<InventoryRecord | null>(null);
  const [form, setForm] = useState<InventoryFormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [search, setSearch] = useState('');

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [inv, itms, sups, whs] = await Promise.all([
        fetchAllInventory(),
        fetchAllItems(),
        fetchAllSuppliers(),
        fetchAllWarehouses(),
      ]);
      setInventory(inv);
      setItems(itms);
      setSuppliers(sups);
      setWarehouses(whs);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  function openCreate() {
    setForm({
      ...emptyForm,
      supplierId: suppliers[0]?.id ?? '',
      warehouseId: warehouses[0]?.id ?? '',
      itemId: items[0]?.id ?? '',
    });
    setFormError(null);
    setModal('create');
  }

  function openEdit(inv: InventoryRecord) {
    setEditTarget(inv);
    setForm({
      supplierId: inv.supplierId,
      warehouseId: inv.warehouseId,
      itemId: inv.itemId,
      remainingQuantity: String(inv.remainingQuantity),
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
    const dto = {
      supplierId: form.supplierId,
      warehouseId: form.warehouseId,
      itemId: form.itemId,
      remainingQuantity: Number(form.remainingQuantity),
    };
    try {
      if (modal === 'edit') {
        await updateInventory(editTarget!.id, dto);
      } else {
        await createInventory(dto);
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
    if (!confirm('Delete this inventory entry? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteInventory(id);
      loadAll();
    } catch (e) {
      alert(e instanceof Error ? e.message : String(e));
    } finally {
      setDeletingId(null);
    }
  }

  const q = search.toLowerCase();
  const filtered = inventory.filter(
    (inv) =>
      !q ||
      inv.item.code.toLowerCase().includes(q) ||
      (inv.item.name ?? '').toLowerCase().includes(q) ||
      inv.supplier.code.toLowerCase().includes(q) ||
      inv.warehouse.code.toLowerCase().includes(q),
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Inventory / Stock</h1>
        <button onClick={openCreate} className={styles.btnPrimary}>+ New Entry</button>
      </div>

      <div className={styles.toolbar}>
        <input
          className={styles.search}
          placeholder="Search item, supplier, warehouse…"
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
        <p className={styles.muted}>{search ? 'No results.' : 'No inventory entries yet.'}</p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Item</th>
                <th className={styles.th}>Supplier</th>
                <th className={styles.th}>Warehouse</th>
                <th className={`${styles.th} ${styles.thRight}`}>Remaining Qty</th>
                <th className={styles.th}>Unit</th>
                <th className={styles.th}>Updated</th>
                <th className={`${styles.th} ${styles.thCenter}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv, i) => (
                <tr key={inv.id} className={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                  <td className={styles.td}>
                    <span className={styles.code}>{inv.item.code}</span>
                    {inv.item.name && <span className={styles.subtext}> {inv.item.name}</span>}
                  </td>
                  <td className={styles.td}>
                    <span className={styles.code}>{inv.supplier.code}</span>
                    {inv.supplier.name && <span className={styles.subtext}> {inv.supplier.name}</span>}
                  </td>
                  <td className={styles.td}>
                    <span className={styles.code}>{inv.warehouse.code}</span>
                    {inv.warehouse.name && <span className={styles.subtext}> {inv.warehouse.name}</span>}
                  </td>
                  <td className={`${styles.td} ${styles.tdRight} ${Number(inv.remainingQuantity) === 0 ? styles.qtyZero : Number(inv.remainingQuantity) < 100 ? styles.qtyLow : styles.qtyOk}`}>
                    {Number(inv.remainingQuantity).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className={styles.td}>{inv.item.unit}</td>
                  <td className={styles.td}>
                    {new Date(inv.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className={`${styles.td} ${styles.tdActions}`}>
                    <button onClick={() => openEdit(inv)} className={`${styles.btnSecondary} ${styles.actionEdit}`}>Edit</button>
                    <button
                      onClick={() => handleDelete(inv.id)}
                      disabled={deletingId === inv.id}
                      className={styles.btnDanger}
                    >
                      {deletingId === inv.id ? '…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.dialogTitle}>
              {modal === 'create' ? 'New Inventory Entry' : 'Edit Inventory'}
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
                Warehouse <span className={styles.required}>*</span>
                <select
                  className={styles.input}
                  value={form.warehouseId}
                  onChange={(e) => setForm((f) => ({ ...f, warehouseId: e.target.value }))}
                  required
                  disabled={modal === 'edit'}
                >
                  <option value="">— select warehouse —</option>
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.code}{w.name ? ` — ${w.name}` : ''}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.label}>
                Remaining Quantity <span className={styles.required}>*</span>
                <input
                  className={styles.input}
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.remainingQuantity}
                  onChange={(e) => setForm((f) => ({ ...f, remainingQuantity: e.target.value }))}
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
