'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from '@/components/CustomerManager/CustomerManager.module.css';
import type { Warehouse } from '@/types/warehouse';
import { fetchAllWarehouses, createWarehouse, updateWarehouse, deleteWarehouse } from '@/lib/api/warehouses/warehouses.api';
import ConfirmModal from '@/components/ConfirmModal/ConfirmModal';

type FormState = { code: string; name: string; isWildcard: boolean };
const emptyForm: FormState = { code: '', name: '', isWildcard: false };

export default function WarehouseManager() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editTarget, setEditTarget] = useState<Warehouse | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try { setWarehouses(await fetchAllWarehouses()); }
    catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  function openCreate() { setForm(emptyForm); setFormError(null); setModal('create'); }
  function openEdit(w: Warehouse) {
    setEditTarget(w);
    setForm({ code: w.code, name: w.name ?? '', isWildcard: w.isWildcard });
    setFormError(null);
    setModal('edit');
  }
  function closeModal() { setModal(null); setEditTarget(null); setFormError(null); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    const dto = { code: form.code.trim(), name: form.name.trim() || undefined, isWildcard: form.isWildcard };
    try {
      if (modal === 'edit') await updateWarehouse(editTarget!.id, dto);
      else await createWarehouse(dto);
      closeModal(); loadAll();
    } catch (e) { setFormError(e instanceof Error ? e.message : String(e)); }
    finally { setSubmitting(false); }
  }

  async function handleDelete(id: string) {
    setConfirmId(null);
    setDeletingId(id);
    try { await deleteWarehouse(id); loadAll(); }
    catch (e) { alert(e instanceof Error ? e.message : String(e)); }
    finally { setDeletingId(null); }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Warehouses</h1>
        <button onClick={openCreate} className={styles.btnPrimary}>+ New Warehouse</button>
      </div>
      {loading && <p className={styles.muted}>Loading…</p>}
      {error && (
        <div className={styles.errorBox}>
          <strong>Error:</strong> {error}
          <button onClick={loadAll} className={`${styles.btnSecondary} ${styles.errorRetry}`}>Retry</button>
        </div>
      )}
      {!loading && !error && warehouses.length === 0 && <p className={styles.muted}>No warehouses yet.</p>}
      {!loading && !error && warehouses.length > 0 && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Code</th>
                <th className={styles.th}>Name</th>
                <th className={`${styles.th} ${styles.thCenter}`}>Wildcard</th>
                <th className={styles.th}>Created</th>
                <th className={`${styles.th} ${styles.thCenter}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map((w, i) => (
                <tr key={w.id} className={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                  <td className={styles.td}><span className={styles.code}>{w.code}</span></td>
                  <td className={styles.td}>{w.name ?? '—'}</td>
                  <td className={`${styles.td} ${styles.tdCenter}`}>{w.isWildcard ? 'Yes' : 'No'}</td>
                  <td className={styles.td}>{new Date(w.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td className={`${styles.td} ${styles.tdActions}`}>
                    <button onClick={() => openEdit(w)} className={`${styles.btnSecondary} ${styles.actionEdit}`}>Edit</button>
                    <button onClick={() => setConfirmId(w.id)} disabled={deletingId === w.id} className={styles.btnDanger}>
                      {deletingId === w.id ? '…' : 'Delete'}
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
          message="Delete this warehouse? This cannot be undone."
          onConfirm={() => handleDelete(confirmId)}
          onCancel={() => setConfirmId(null)}
        />
      )}
      {modal && (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.dialogTitle}>{modal === 'create' ? 'New Warehouse' : 'Edit Warehouse'}</h2>
            <form onSubmit={handleSubmit}>
              <label className={styles.label}>
                Code <span className={styles.required}>*</span>
                <input className={styles.input} value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} required placeholder="e.g. WH-001" />
              </label>
              <label className={styles.label}>
                Name
                <input className={styles.input} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Warehouse name" />
              </label>
              <label className={styles.label} style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" checked={form.isWildcard} onChange={(e) => setForm((f) => ({ ...f, isWildcard: e.target.checked }))} />
                Wildcard (WH-000 = any warehouse)
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
