'use client';

import styles from './ConfirmModal.module.css';

type Props = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({ message, onConfirm, onCancel }: Props) {
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button onClick={onCancel} className={styles.btnCancel}>Cancel</button>
          <button onClick={onConfirm} className={styles.btnDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
}
