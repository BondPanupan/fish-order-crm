'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './CustomerManager.module.css';
import type { Customer, CustomerFormState } from '@/types/customer';
import {
  fetchAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '@/lib/api/customers/customers.api';
import ConfirmModal from '@/components/ConfirmModal/ConfirmModal';

const emptyForm: CustomerFormState = { code: '', name: '', creditLimit: '' };

export default function CustomerManager() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editTarget, setEditTarget] = useState<Customer | null>(null);
  const [form, setForm] = useState<CustomerFormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCustomers(await fetchAllCustomers());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  function openCreate() {
    setForm(emptyForm);
    setFormError(null);
    setModal('create');
  }

  function openEdit(c: Customer) {
    setEditTarget(c);
    setForm({ code: c.code, name: c.name ?? '', creditLimit: String(c.creditLimit) });
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
      code: form.code.trim(),
      ...(form.name.trim() && { name: form.name.trim() }),
      ...(form.creditLimit !== '' && { creditLimit: Number(form.creditLimit) }),
    };
    try {
      if (modal === 'edit') {
        await updateCustomer(editTarget!.id, dto);
      } else {
        await createCustomer(dto);
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
      await deleteCustomer(id);
      loadAll();
    } catch (e) {
      alert(e instanceof Error ? e.message : String(e));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Customers</h1>
        <button onClick={openCreate} className={styles.btnPrimary}>+ New Customer</button>
      </div>

      {loading && <p className={styles.muted}>Loading…</p>}

      {error && (
        <div className={styles.errorBox}>
          <strong>Error:</strong> {error}
          <button onClick={loadAll} className={`${styles.btnSecondary} ${styles.errorRetry}`}>Retry</button>
        </div>
      )}

      {!loading && !error && customers.length === 0 && (
        <p className={styles.muted}>No customers yet. Create one to get started.</p>
      )}

      {!loading && !error && customers.length > 0 && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Code</th>
                <th className={styles.th}>Name</th>
                <th className={`${styles.th} ${styles.thRight}`}>Credit Limit</th>
                <th className={`${styles.th} ${styles.thCenter}`}>Orders</th>
                <th className={styles.th}>Created</th>
                <th className={`${styles.th} ${styles.thCenter}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={c.id} className={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                  <td className={styles.td}>
                    <span className={styles.code}>{c.code}</span>
                  </td>
                  <td className={styles.td}>{c.name ?? '—'}</td>
                  <td className={`${styles.td} ${styles.tdRight}`}>
                    {Number(c.creditLimit).toLocaleString('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 2 })}
                  </td>
                  <td className={`${styles.td} ${styles.tdCenter}`}>{c._count.orders}</td>
                  <td className={styles.td}>
                    {new Date(c.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className={`${styles.td} ${styles.tdActions}`}>
                    <button onClick={() => openEdit(c)} className={`${styles.btnSecondary} ${styles.actionEdit}`}>Edit</button>
                    <button
                      onClick={() => setConfirmId(c.id)}
                      disabled={deletingId === c.id}
                      className={styles.btnDanger}
                    >
                      {deletingId === c.id ? '…' : 'Delete'}
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
          message="Delete this customer? This cannot be undone."
          onConfirm={() => handleDelete(confirmId)}
          onCancel={() => setConfirmId(null)}
        />
      )}

      {modal && (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.dialog} onClick={e => e.stopPropagation()}>
            <h2 className={styles.dialogTitle}>
              {modal === 'create' ? 'New Customer' : 'Edit Customer'}
            </h2>
            <form onSubmit={handleSubmit}>
              <label className={styles.label}>
                Code <span className={styles.required}>*</span>
                <input
                  className={styles.input}
                  value={form.code}
                  onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                  required
                  placeholder="e.g. CUST001"
                />
              </label>
              <label className={styles.label}>
                Name
                <input
                  className={styles.input}
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Customer name"
                />
              </label>
              <label className={styles.label}>
                Credit Limit (THB)
                <input
                  className={styles.input}
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.creditLimit}
                  onChange={e => setForm(f => ({ ...f, creditLimit: e.target.value }))}
                  placeholder="0.00"
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
