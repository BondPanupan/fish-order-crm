'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from '@/components/CustomerManager/CustomerManager.module.css';
import type { Item } from '@/types/item';
import { fetchAllItems, createItem, updateItem, deleteItem } from '@/lib/api/items/items.api';

type FormState = { code: string; name: string; unit: string };
const emptyForm: FormState = { code: '', name: '', unit: 'kg' };

export default function ItemManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editTarget, setEditTarget] = useState<Item | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try { setItems(await fetchAllItems()); }
    catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  function openCreate() { setForm(emptyForm); setFormError(null); setModal('create'); }
  function openEdit(it: Item) {
    setEditTarget(it);
    setForm({ code: it.code, name: it.name ?? '', unit: it.unit });
    setFormError(null);
    setModal('edit');
  }
  function closeModal() { setModal(null); setEditTarget(null); setFormError(null); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    const dto = { code: form.code.trim(), name: form.name.trim() || undefined, unit: form.unit.trim() || 'kg' };
    try {
      if (modal === 'edit') await updateItem(editTarget!.id, dto);
      else await createItem(dto);
      closeModal(); loadAll();
    } catch (e) { setFormError(e instanceof Error ? e.message : String(e)); }
    finally { setSubmitting(false); }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try { await deleteItem(id); loadAll(); }
    catch (e) { alert(e instanceof Error ? e.message : String(e)); }
    finally { setDeletingId(null); }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Items</h1>
        <button onClick={openCreate} className={styles.btnPrimary}>+ New Item</button>
      </div>
      {loading && <p className={styles.muted}>Loading…</p>}
      {error && (
        <div className={styles.errorBox}>
          <strong>Error:</strong> {error}
          <button onClick={loadAll} className={`${styles.btnSecondary} ${styles.errorRetry}`}>Retry</button>
        </div>
      )}
      {!loading && !error && items.length === 0 && <p className={styles.muted}>No items yet.</p>}
      {!loading && !error && items.length > 0 && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Code</th>
                <th className={styles.th}>Name</th>
                <th className={styles.th}>Unit</th>
                <th className={`${styles.th} ${styles.thCenter}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={it.id} className={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                  <td className={styles.td}><span className={styles.code}>{it.code}</span></td>
                  <td className={styles.td}>{it.name ?? '—'}</td>
                  <td className={styles.td}>{it.unit}</td>
                  <td className={`${styles.td} ${styles.tdActions}`}>
                    <button onClick={() => openEdit(it)} className={`${styles.btnSecondary} ${styles.actionEdit}`}>Edit</button>
                    <button onClick={() => handleDelete(it.id)} disabled={deletingId === it.id} className={styles.btnDanger}>
                      {deletingId === it.id ? '…' : 'Delete'}
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
            <h2 className={styles.dialogTitle}>{modal === 'create' ? 'New Item' : 'Edit Item'}</h2>
            <form onSubmit={handleSubmit}>
              <label className={styles.label}>
                Code <span className={styles.required}>*</span>
                <input className={styles.input} value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} required placeholder="e.g. Item-1" />
              </label>
              <label className={styles.label}>
                Name
                <input className={styles.input} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Item name" />
              </label>
              <label className={styles.label}>
                Unit
                <input className={styles.input} value={form.unit} onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))} placeholder="kg" />
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
